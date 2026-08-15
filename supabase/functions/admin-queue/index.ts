// supabase/functions/admin-queue/index.ts
//
// Companion to intake/index.ts. Two actions, both gated by x-intake-secret
// (same secret as intake), both using the service role key so they can
// see/write rows regardless of RLS:
//
//   GET    -> returns all rows where active = false (the review queue)
//   PATCH  -> body { id } -> flips that row's active to true
//   DELETE -> body { id } -> deletes a rejected pending row
//
// Same required secrets as intake/index.ts (INTAKE_SECRET, SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY) — no new secrets needed.
//
// Deploy with: supabase functions deploy admin-queue --no-verify-jwt
// (--no-verify-jwt is required — otherwise Supabase's own gateway
// rejects the request before our x-intake-secret check ever runs.)

import { createClient } from "jsr:@supabase/supabase-js@2";

const INTAKE_SECRET = Deno.env.get("INTAKE_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-intake-secret",
    "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
  };
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  if (req.headers.get("x-intake-secret") !== INTAKE_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, products: data }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing 'id'" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (req.method === "PATCH") {
      const { data, error } = await supabase
        .from("products")
        .update({ active: true })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, product: data }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});