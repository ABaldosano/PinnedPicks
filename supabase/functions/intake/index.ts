// supabase/functions/intake/index.ts
//
// Internal-only intake endpoint. Called from pages/admin/intake.html.
//
// NOTE: We originally tried auto-fetching og:title/og:image from the
// Shopee product page server-side. Shopee serves an empty bot-detection
// shell to non-browser requests (no title, no meta tags, no embedded
// JSON — confirmed via debugging), so that part isn't feasible without
// a full headless-browser rendering service. Title and image are now
// entered manually from the page you're already looking at; everything
// after that (Involve Asia conversion + Supabase insert) stays automated.
//
// Flow:
//   1. Verify the caller sent the correct x-intake-secret header.
//   2. Get an Involve Asia bearer token (POST /api/authenticate).
//   3. Resolve the Shopee Philippines offer_id (POST /api/offers/all),
//      cached in-memory so we don't look it up on every request.
//   4. Convert the URL into a tracked deeplink (POST /api/deeplink/generate).
//   5. Insert a row into `products` with active = false, using the
//      SERVICE ROLE key (bypasses RLS; never exposed to the browser).
//
// Confirmed against Involve Asia's live docs (api.involve.asia/docs):
//   - All Involve Asia calls use form-urlencoded bodies, NOT JSON.
//   - POST /api/authenticate  body: key, secret  -> token at data.token
//   - POST /api/offers/all    body: filters[...] -> data.data[] (array of offers)
//   - POST /api/deeplink/generate body: offer_id, url, aff_sub (optional)
//         -> tracked link at data.tracking_link
//   - Tokens last 2 hours. Rate limit: 60 req/min overall,
//     deeplink/generate additionally capped at 1,000 links / rolling 30 days.
//
// Required secrets (set via `supabase secrets set ...`):
//   INTAKE_SECRET             - your own made-up password, sent as
//                                x-intake-secret header from intake.html
//   SUPABASE_URL               - auto-provided by Supabase
//   SUPABASE_SERVICE_ROLE_KEY  - auto-provided by Supabase
//   INVOLVE_ASIA_API_KEY
//   INVOLVE_ASIA_API_SECRET
//
// Deploy with: supabase functions deploy intake --no-verify-jwt
// (--no-verify-jwt is required — otherwise Supabase's own gateway
// rejects the request before our x-intake-secret check ever runs.)

import { createClient } from "jsr:@supabase/supabase-js@2";

const INTAKE_SECRET = Deno.env.get("INTAKE_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const IA_KEY = Deno.env.get("INVOLVE_ASIA_API_KEY")!;
const IA_SECRET = Deno.env.get("INVOLVE_ASIA_API_SECRET")!;

const IA_BASE = "https://api.involve.asia/api";

let tokenCache: { value: string; expiresAt: number } | null = null;
let offerIdCache: { value: number; expiresAt: number } | null = null;

function formBody(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

async function getInvolveAsiaToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.value;

  const res = await fetch(`${IA_BASE}/authenticate`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody({ key: IA_KEY, secret: IA_SECRET }),
  });
  if (!res.ok) {
    throw new Error(`Involve Asia auth failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const token = data?.data?.token;
  if (!token) throw new Error(`Involve Asia auth: no token in response: ${JSON.stringify(data)}`);

  tokenCache = { value: token, expiresAt: Date.now() + 1000 * 60 * 110 };
  return token;
}

async function getShopeePhilippinesOfferId(token: string): Promise<number> {
  if (offerIdCache && offerIdCache.expiresAt > Date.now()) return offerIdCache.value;

  const res = await fetch(`${IA_BASE}/offers/all`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody({
      "filters[offer_name]": "Shopee",
      "filters[offer_country]": "Philippines",
      "filters[application_status]": "Approved",
      "filters[offer_status]": "Active",
      limit: "10",
    }),
  });
  if (!res.ok) {
    throw new Error(`Involve Asia offers/all failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const offers = data?.data?.data;
  if (!Array.isArray(offers) || offers.length === 0) {
    throw new Error(
      `No approved/active Shopee Philippines offer found on this account. Raw response: ${JSON.stringify(data)}`,
    );
  }
  const offerId = offers[0].offer_id;

  offerIdCache = { value: offerId, expiresAt: Date.now() + 1000 * 60 * 60 * 24 };
  return offerId;
}

async function generateDeeplink(token: string, offerId: number, productUrl: string): Promise<string> {
  const res = await fetch(`${IA_BASE}/deeplink/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody({
      offer_id: String(offerId),
      url: productUrl,
      aff_sub: "pinnedpicks-intake",
    }),
  });
  if (!res.ok) {
    throw new Error(`Involve Asia deeplink/generate failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const link = data?.data?.tracking_link;
  if (!link) throw new Error(`Involve Asia deeplink: no tracking_link in response: ${JSON.stringify(data)}`);
  return link;
}

Deno.serve(async (req: Request) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-intake-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    if (req.headers.get("x-intake-secret") !== INTAKE_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const productUrl: string = body?.url;
    const title: string = body?.title;
    const image: string = body?.image;
    const platform: string = body?.platform ?? "shopee";
    const section: string = body?.section ?? "electronics";
    const category: string | null = body?.category ?? null;

    if (!productUrl || !title || !image) {
      return new Response(
        JSON.stringify({ error: "Missing required field(s): url, title, and image are all required." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    // 1. Involve Asia: auth -> resolve offer -> generate tracked link.
    const token = await getInvolveAsiaToken();
    const offerId = await getShopeePhilippinesOfferId(token);
    const trackedLink = await generateDeeplink(token, offerId, productUrl);

    // 2. Insert as pending (active = false) via service role (bypasses RLS).
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from("products")
      .insert({
        platform,
        section,
        category,
        title,
        alt: title,
        href: trackedLink,
        img: image,
        active: false,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, product: data, offer_id: offerId }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});