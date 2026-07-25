-- ============================================================
-- PinnedPicks — Supabase schema (Shopee-only, Lazada-ready)
-- Run this once in the Supabase SQL Editor.
-- ============================================================

create table if not exists products (
  id          bigint generated always as identity primary key,
  platform    text not null check (platform in ('shopee', 'lazada')),
  section     text not null,        -- e.g. 'best_1', 'best_2', 'fashion', 'electronics'
  category    text,                 -- null for featured/best-seller rows, set for category rows
  title       text not null,
  alt         text,
  href        text not null,
  img         text not null,
  img_class   text,                 -- e.g. 'pin-portrait', nullable
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists idx_products_platform_section on products (platform, section, sort_order);
create index if not exists idx_products_active on products (active);

-- Row Level Security: public can read active rows only; no public write access.
alter table products enable row level security;

create policy "Public read active products"
  on products for select
  to anon
  using (active = true);

-- No insert/update/delete policy is created for `anon` — this means the
-- public key can never write. You manage data via the Supabase Table
-- Editor / SQL Editor while logged in as the project owner, which uses
-- the service role and bypasses RLS.

-- ============================================================
-- Seed data: existing Shopee catalog (60 products)
-- ============================================================

insert into products (platform, section, category, title, alt, href, img, img_class, sort_order) values
  ('shopee', 'best_1', NULL, 'Stainless Stove Rack Keeps Small Pots Stable', 'Stainless Stove Rack', 'https://invl.me/clngowe', 'assets/images/featured/s1.png', NULL, 0),
  ('shopee', 'best_1', NULL, 'Waterproof School Backpack Fits Laptop & Books', 'Waterproof School Backpack', 'https://invl.me/clngowg', 'assets/images/featured/s2.png', NULL, 1),
  ('shopee', 'best_1', NULL, '10pcs Gel Pens Write Smooth & Dry Fast', 'Gel Pens', 'https://invl.me/clngowi', 'assets/images/featured/s3.png', NULL, 2),
  ('shopee', 'best_1', NULL, 'Cotton Mid-Cut Socks Keep Feet Fresh All Day', 'Cotton Mid-Cut Socks', 'https://invl.me/clngowj', 'assets/images/featured/s4.png', NULL, 3),
  ('shopee', 'best_1', NULL, 'Mini USB Humidifier Adds Calm to Any Space', 'Mini USB Humidifier', 'https://invl.me/clngowo', 'assets/images/featured/s5.png', NULL, 4),
  ('shopee', 'best_1', NULL, '7-in-1 Stationery Set Has 7 Tools in One Pack', '7-in-1 Stationery Set', 'https://invl.me/clngowq', 'assets/images/featured/s6.png', NULL, 5),
  ('shopee', 'best_1', NULL, '10 Pairs Cotton Socks Keep Feet Cool & Comfy', '10 Pairs Cotton Socks', 'https://invl.me/clngowr', 'assets/images/featured/s7.png', NULL, 6),
  ('shopee', 'best_1', NULL, 'A5 Spiral Notebook Set Smooth Writing & Thick Pages', 'A5 Spiral Notebook Set', 'https://invl.me/clngowt', 'assets/images/featured/s8.png', NULL, 7),
  ('shopee', 'best_1', NULL, 'VeryMall Crew Socks 5–10 Pairs for Daily Comfort', 'VeryMall Crew Socks', 'https://invl.me/clngowu', 'assets/images/featured/s9.png', NULL, 8),
  ('shopee', 'best_1', NULL, 'EVO GT-PRO Helmet with Dual Visor Protection', 'EVO GT-PRO Helmet', 'https://invl.me/clngowv', 'assets/images/featured/s10.png', NULL, 9),
  ('shopee', 'best_2', NULL, 'Korean Nylon Backpack Is Waterproof & Stylish', 'Korean Nylon Backpack', 'https://invl.me/clngoww', 'assets/images/featured/s11.png', NULL, 0),
  ('shopee', 'best_2', NULL, 'MPMG Oversized Tees Buy 1 Get 3 Deal', 'MPMG Oversized Tees', 'https://invl.me/clngowy', 'assets/images/featured/s12.png', NULL, 1),
  ('shopee', 'best_2', NULL, 'Korean Running Shoes Feel Light & Comfortable', 'Korean Running Shoes', 'https://invl.me/clngowz', 'assets/images/featured/s13.png', NULL, 2),
  ('shopee', 'best_2', NULL, 'Korean Sneakers Are Breathable & Comfortable', 'Korean Sneakers', 'https://invl.me/clngox0', 'assets/images/featured/s14.png', NULL, 3),
  ('shopee', 'best_2', NULL, 'E88 Pro Drone Has 4K Camera & 150m Range', 'E88 Pro Drone', 'https://invl.me/clngox2', 'assets/images/featured/s15.png', NULL, 4),
  ('shopee', 'best_2', NULL, 'Light Sole Sports Shoes Feel Comfortable All Day', 'Light Sole Sports Shoes', 'https://invl.me/clngox3', 'assets/images/featured/s16.png', NULL, 5),
  ('shopee', 'best_2', NULL, 'Naviforce NF9117 Watch Looks Premium & Sporty', 'Naviforce NF9117 Watch', 'https://invl.me/clngox4', 'assets/images/featured/s17.png', NULL, 6),
  ('shopee', 'best_2', NULL, 'Casual Leather Shoes Match Any Everyday Outfit', 'Casual Leather Shoes', 'https://invl.me/clngox5', 'assets/images/featured/s18.png', NULL, 7),
  ('shopee', 'best_2', NULL, 'Lovito Striped Jumpsuit Is Perfect for Warm Days', 'Lovito Striped Jumpsuit', 'https://invl.me/clngox7', 'assets/images/featured/s19.png', NULL, 8),
  ('shopee', 'best_2', NULL, 'Retro Striped Tee Gives Effortless Streetwear Style', 'Retro Striped Tee', 'https://invl.me/clngox9', 'assets/images/featured/s20.png', NULL, 9),
  ('shopee', 'fashion', 'fashion', 'Lovito Boho Dress Adds Effortless Summer Charm', 'Lovito Boho Dress', 'https://invl.me/clngv3j', 'assets/images/platforms/shopee/Fashion/sfash1.webp', NULL, 0),
  ('shopee', 'fashion', 'fashion', '3pcs Ladies Boxer Shorts Feel Soft & Comfy', '3pcs Ladies Boxer Shorts', 'https://invl.me/clngv3k', 'assets/images/platforms/shopee/Fashion/sfash2.webp', NULL, 1),
  ('shopee', 'fashion', 'fashion', 'Lovito Resort Dress Perfect for Summer Getaways', 'Lovito Resort Dress', 'https://invl.me/clngv3l', 'assets/images/platforms/shopee/Fashion/sfash3.webp', NULL, 2),
  ('shopee', 'fashion', 'fashion', 'Lovito Belted Dress Has Pockets & Easy Style', 'Lovito Belted Dress', 'https://invl.me/clngv3n', 'assets/images/platforms/shopee/Fashion/sfash4.webp', NULL, 3),
  ('shopee', 'fashion', 'fashion', 'Lovito Mesh Dress Gives Elegant Feminine Style', 'Lovito Mesh Dress', 'https://invl.me/clngv3o', 'assets/images/platforms/shopee/Fashion/sfash5.webp', 'pin-portrait', 4),
  ('shopee', 'fashion', 'fashion', 'Lovito Elegant Cardigan Matches Every Outfit Easily', 'Lovito Elegant Cardigan', 'https://invl.me/clngv3p', 'assets/images/platforms/shopee/Fashion/sfash6.webp', NULL, 5),
  ('shopee', 'fashion', 'fashion', 'Lovito Button Cardigan Adds Effortless Casual Style', 'Lovito Button Cardigan', 'https://invl.me/clngv3r', 'assets/images/platforms/shopee/Fashion/sfash7.webp', NULL, 6),
  ('shopee', 'fashion', 'fashion', 'INSPI Textured Cardigan Gives Effortless Clean Style', 'INSPI Textured Cardigan', 'https://invl.me/clngv3s', 'assets/images/platforms/shopee/Fashion/sfash8.webp', NULL, 7),
  ('shopee', 'fashion', 'fashion', 'Harmony Maxi Dress Gives Elegant Flowy Style', 'Harmony Maxi Dress', 'https://invl.me/clngv3v', 'assets/images/platforms/shopee/Fashion/sfash9.webp', NULL, 8),
  ('shopee', 'fashion', 'fashion', 'YISO Pajama Set Feels Soft & Extra Comfy', 'YISO Pajama Set', 'https://invl.me/clngv3w', 'assets/images/platforms/shopee/Fashion/sfash10.webp', NULL, 9),
  ('shopee', 'electronics', 'electronics', 'Orashare Mini Fan Fits Anywhere & Cools Fast', 'Orashare Mini Fan', 'https://invl.me/clngv3y', 'assets/images/platforms/shopee/Electronics/selec1.webp', NULL, 0),
  ('shopee', 'electronics', 'electronics', 'GOOJODOQ Turbo Mini Fan Has Strong Cooling Power', 'GOOJODOQ Turbo Mini Fan', 'https://invl.me/clngv3z', 'assets/images/platforms/shopee/Electronics/selec2.webp', NULL, 1),
  ('shopee', 'electronics', 'electronics', 'TECNO SPARK GO 3 Has 120Hz Display & 5000mAh Battery', 'TECNO SPARK GO 3', 'https://invl.me/clngv40', 'assets/images/platforms/shopee/Electronics/selec3.webp', NULL, 2),
  ('shopee', 'electronics', 'electronics', 'Orashare Capsule Powerbank Fits in Your Pocket', 'Orashare Capsule Powerbank', 'https://invl.me/clngv42', 'assets/images/platforms/shopee/Electronics/selec4.webp', NULL, 3),
  ('shopee', 'electronics', 'electronics', 'Cordless Rechargeable Fan Runs for Hours Anywhere', 'Cordless Rechargeable Fan', 'https://invl.me/clngv43', 'assets/images/platforms/shopee/Electronics/selec5.webp', 'pin-portrait', 4),
  ('shopee', 'electronics', 'electronics', 'HUAWEI Band 11 Makes Fitness Tracking Effortless', 'HUAWEI Band 11', 'https://invl.me/clngv44', 'assets/images/platforms/shopee/Electronics/selec6.webp', NULL, 5),
  ('shopee', 'electronics', 'electronics', 'Samsung Galaxy A25/A26 Delivers Smooth Everyday Performance', 'Samsung Galaxy A25/A26', 'https://invl.me/clngv45', 'assets/images/platforms/shopee/Electronics/selec7.webp', NULL, 6),
  ('shopee', 'electronics', 'electronics', 'Xiaomi Mi Pad Handles Gaming, Streaming & Multitasking', 'Xiaomi Mi Pad', 'https://invl.me/clngv46', 'assets/images/platforms/shopee/Electronics/selec8.webp', NULL, 7),
  ('shopee', 'electronics', 'electronics', 'Galaxy Tab S9 Is Built for Gaming & Productivity', 'Galaxy Tab S9', 'https://invl.me/clngv48', 'assets/images/platforms/shopee/Electronics/selec9.webp', NULL, 8),
  ('shopee', 'electronics', 'electronics', 'EMEET C60E Webcam Delivers Crisp 4K Video Quality', 'EMEET C60E Webcam', 'https://invl.me/clngv49', 'assets/images/platforms/shopee/Electronics/selec10.webp', NULL, 9),
  ('shopee', 'health', 'health', 'Originote Ceramella Sunscreen SPF50 Is a Bestseller', 'Originote Ceramella Sunscreen SPF50', 'https://invl.me/clngv4i', 'assets/images/platforms/shopee/Health/sheal1.webp', NULL, 0),
  ('shopee', 'health', 'health', 'SKINEVER Sunscreen Lotion Is Buy 1 Take 1', 'SKINEVER Sunscreen Lotion', 'https://invl.me/clngv4j', 'assets/images/platforms/shopee/Health/sheal2.webp', NULL, 1),
  ('shopee', 'health', 'health', 'Luxe Organix Maxshield Sunscreen Protects Face & Body', 'Luxe Organix Maxshield Sunscreen', 'https://invl.me/clngv4k', 'assets/images/platforms/shopee/Health/sheal3.webp', NULL, 2),
  ('shopee', 'health', 'health', 'MinoxiPlus 5% Helps Support Hair Growth Routine', 'MinoxiPlus 5%', 'https://invl.me/clngv4m', 'assets/images/platforms/shopee/Health/sheal4.webp', NULL, 3),
  ('shopee', 'health', 'health', 'Kérastase Genesis Serum Helps Reduce Hair Fall', 'Kérastase Genesis Serum', 'https://invl.me/clngv4n', 'assets/images/platforms/shopee/Health/sheal5.webp', NULL, 4),
  ('shopee', 'health', 'health', 'Black Sesame Hair Serum Supports Healthier Hair Growth', 'Black Sesame Hair Serum', 'https://invl.me/clngv4o', 'assets/images/platforms/shopee/Health/sheal6.webp', NULL, 5),
  ('shopee', 'health', 'health', 'Bodywise Rosemary Serum Supports Stronger-Looking Hair', 'Bodywise Rosemary Serum', 'https://invl.me/clngv4r', 'assets/images/platforms/shopee/Health/sheal7.webp', NULL, 6),
  ('shopee', 'health', 'health', 'Rogaine 5% Foam Supports Hair Regrowth Routine', 'Rogaine 5% Foam', 'https://invl.me/clngv4x', 'assets/images/platforms/shopee/Health/sheal8.webp', NULL, 7),
  ('shopee', 'health', 'health', 'Dermorepubliq Niacinamide Serum Helps Brighten Skin', 'Dermorepubliq Niacinamide Serum', 'https://invl.me/clngv4y', 'assets/images/platforms/shopee/Health/sheal9.webp', NULL, 8),
  ('shopee', 'health', 'health', 'Dermorepubliq Glycolic Toner Helps Smooth & Refresh Skin', 'Dermorepubliq Glycolic Toner', 'https://invl.me/clngv4z', 'assets/images/platforms/shopee/Health/sheal10.webp', NULL, 9),
  ('shopee', 'groceries', 'groceries', 'DUJOSOO Black Coffee Has High Protein & Zero Fat', 'DUJOSOO Black Coffee', 'https://invl.me/clngv5l', 'assets/images/platforms/shopee/Groceries/scons1.webp', NULL, 0),
  ('shopee', 'groceries', 'groceries', 'Mood Food Peanut Butter Packs High Protein Energy', 'Mood Food Peanut Butter', 'https://invl.me/clngv5m', 'assets/images/platforms/shopee/Groceries/scons2.webp', NULL, 1),
  ('shopee', 'groceries', 'groceries', 'ON Gold Standard Whey Is a Top Protein Pick', 'ON Gold Standard Whey', 'https://invl.me/clngv5n', 'assets/images/platforms/shopee/Groceries/scons3.webp', NULL, 2),
  ('shopee', 'groceries', 'groceries', 'Blitz Protein Bars Make High Protein Snacking Easy', 'Blitz Protein Bars', 'https://invl.me/clngv5o', 'assets/images/platforms/shopee/Groceries/scons4.webp', NULL, 3),
  ('shopee', 'groceries', 'groceries', 'Anchor Protein Plus Milk Is Buy 2 Take 1', 'Anchor Protein Plus Milk', 'https://invl.me/clngv5q', 'assets/images/platforms/shopee/Groceries/scons5.webp', NULL, 4),
  ('shopee', 'groceries', 'groceries', 'Pure Form Creatine Helps Support Strength & Muscle Growth', 'Pure Form Creatine', 'https://invl.me/clngv5r', 'assets/images/platforms/shopee/Groceries/scons6.webp', NULL, 5),
  ('shopee', 'groceries', 'groceries', 'ON Creatine Powder Supports Strength & Workout Performance', 'ON Creatine Powder', 'https://invl.me/clngv5s', 'assets/images/platforms/shopee/Groceries/scons7.webp', NULL, 6),
  ('shopee', 'groceries', 'groceries', 'ATC Fish Oil Supports Everyday Wellness & Nutrition', 'ATC Fish Oil', 'https://invl.me/clngv5t', 'assets/images/platforms/shopee/Groceries/scons8.webp', NULL, 7),
  ('shopee', 'groceries', 'groceries', 'VTEAY Omega 3 Combines Fish Oil & Collagen Support', 'VTEAY Omega 3', 'https://invl.me/clngv5u', 'assets/images/platforms/shopee/Groceries/scons9.webp', NULL, 8),
  ('shopee', 'groceries', 'groceries', 'Herbalife F1 Shake Makes High Protein Nutrition Easy', 'Herbalife F1 Shake', 'https://invl.me/clngv5v', 'assets/images/platforms/shopee/Groceries/scons10.webp', NULL, 9);