// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initTouchSwipe();
  shuffleAllCards();
  initAutoSlider();
  initSavedPins();
});


// ═════════════════════════════════════════════════════════════════════
//  product data. you can also pick products here if you want ( ͡° ͜ʖ ͡°)
// ═════════════════════════════════════════════════════════════════════

const PRODUCTS = {
  shopee_best_1: [
    { title: "Stainless Stove Rack Keeps Small Pots Stable", alt: "Stainless Stove Rack", href: "https://invl.me/clngowe", img: "assets/images/featured/s1.png" },
    { title: "Waterproof School Backpack Fits Laptop & Books", alt: "Waterproof School Backpack", href: "https://invl.me/clngowg", img: "assets/images/featured/s2.png" },
    { title: "10pcs Gel Pens Write Smooth & Dry Fast", alt: "Gel Pens", href: "https://invl.me/clngowi", img: "assets/images/featured/s3.png" },
    { title: "Cotton Mid-Cut Socks Keep Feet Fresh All Day", alt: "Cotton Mid-Cut Socks", href: "https://invl.me/clngowj", img: "assets/images/featured/s4.png" },
    { title: "Mini USB Humidifier Adds Calm to Any Space", alt: "Mini USB Humidifier", href: "https://invl.me/clngowo", img: "assets/images/featured/s5.png" },
    { title: "7-in-1 Stationery Set Has 7 Tools in One Pack", alt: "7-in-1 Stationery Set", href: "https://invl.me/clngowq", img: "assets/images/featured/s6.png" },
    { title: "10 Pairs Cotton Socks Keep Feet Cool & Comfy", alt: "10 Pairs Cotton Socks", href: "https://invl.me/clngowr", img: "assets/images/featured/s7.png" },
    { title: "A5 Spiral Notebook Set Smooth Writing & Thick Pages", alt: "A5 Spiral Notebook Set", href: "https://invl.me/clngowt", img: "assets/images/featured/s8.png" },
    { title: "VeryMall Crew Socks 5–10 Pairs for Daily Comfort", alt: "VeryMall Crew Socks", href: "https://invl.me/clngowu", img: "assets/images/featured/s9.png" },
    { title: "EVO GT-PRO Helmet with Dual Visor Protection", alt: "EVO GT-PRO Helmet", href: "https://invl.me/clngowv", img: "assets/images/featured/s10.png" }
  ],
  shopee_best_2: [
    { title: "Korean Nylon Backpack Is Waterproof & Stylish", alt: "Korean Nylon Backpack", href: "https://invl.me/clngoww", img: "assets/images/featured/s11.png" },
    { title: "MPMG Oversized Tees Buy 1 Get 3 Deal", alt: "MPMG Oversized Tees", href: "https://invl.me/clngowy", img: "assets/images/featured/s12.png" },
    { title: "Korean Running Shoes Feel Light & Comfortable", alt: "Korean Running Shoes", href: "https://invl.me/clngowz", img: "assets/images/featured/s13.png" },
    { title: "Korean Sneakers Are Breathable & Comfortable", alt: "Korean Sneakers", href: "https://invl.me/clngox0", img: "assets/images/featured/s14.png" },
    { title: "E88 Pro Drone Has 4K Camera & 150m Range", alt: "E88 Pro Drone", href: "https://invl.me/clngox2", img: "assets/images/featured/s15.png" },
    { title: "Light Sole Sports Shoes Feel Comfortable All Day", alt: "Light Sole Sports Shoes", href: "https://invl.me/clngox3", img: "assets/images/featured/s16.png" },
    { title: "Naviforce NF9117 Watch Looks Premium & Sporty", alt: "Naviforce NF9117 Watch", href: "https://invl.me/clngox4", img: "assets/images/featured/s17.png" },
    { title: "Casual Leather Shoes Match Any Everyday Outfit", alt: "Casual Leather Shoes", href: "https://invl.me/clngox5", img: "assets/images/featured/s18.png" },
    { title: "Lovito Striped Jumpsuit Is Perfect for Warm Days", alt: "Lovito Striped Jumpsuit", href: "https://invl.me/clngox7", img: "assets/images/featured/s19.png" },
    { title: "Retro Striped Tee Gives Effortless Streetwear Style", alt: "Retro Striped Tee", href: "https://invl.me/clngox9", img: "assets/images/featured/s20.png" }
  ],
  shopee_fashion: [
    { title: "Lovito Boho Dress Adds Effortless Summer Charm", alt: "Lovito Boho Dress", href: "https://invl.me/clngv3j", img: "assets/images/platforms/shopee/Fashion/sfash1.webp" },
    { title: "3pcs Ladies Boxer Shorts Feel Soft & Comfy", alt: "3pcs Ladies Boxer Shorts", href: "https://invl.me/clngv3k", img: "assets/images/platforms/shopee/Fashion/sfash2.webp" },
    { title: "Lovito Resort Dress Perfect for Summer Getaways", alt: "Lovito Resort Dress", href: "https://invl.me/clngv3l", img: "assets/images/platforms/shopee/Fashion/sfash3.webp" },
    { title: "Lovito Belted Dress Has Pockets & Easy Style", alt: "Lovito Belted Dress", href: "https://invl.me/clngv3n", img: "assets/images/platforms/shopee/Fashion/sfash4.webp" },
    { title: "Lovito Mesh Dress Gives Elegant Feminine Style", alt: "Lovito Mesh Dress", href: "https://invl.me/clngv3o", img: "assets/images/platforms/shopee/Fashion/sfash5.webp", imgClass: "pin-portrait" },
    { title: "Lovito Elegant Cardigan Matches Every Outfit Easily", alt: "Lovito Elegant Cardigan", href: "https://invl.me/clngv3p", img: "assets/images/platforms/shopee/Fashion/sfash6.webp" },
    { title: "Lovito Button Cardigan Adds Effortless Casual Style", alt: "Lovito Button Cardigan", href: "https://invl.me/clngv3r", img: "assets/images/platforms/shopee/Fashion/sfash7.webp" },
    { title: "INSPI Textured Cardigan Gives Effortless Clean Style", alt: "INSPI Textured Cardigan", href: "https://invl.me/clngv3s", img: "assets/images/platforms/shopee/Fashion/sfash8.webp" },
    { title: "Harmony Maxi Dress Gives Elegant Flowy Style", alt: "Harmony Maxi Dress", href: "https://invl.me/clngv3v", img: "assets/images/platforms/shopee/Fashion/sfash9.webp" },
    { title: "YISO Pajama Set Feels Soft & Extra Comfy", alt: "YISO Pajama Set", href: "https://invl.me/clngv3w", img: "assets/images/platforms/shopee/Fashion/sfash10.webp" }
  ],
  shopee_electronics: [
    { title: "Orashare Mini Fan Fits Anywhere & Cools Fast", alt: "Orashare Mini Fan", href: "https://invl.me/clngv3y", img: "assets/images/platforms/shopee/Electronics/selec1.webp" },
    { title: "GOOJODOQ Turbo Mini Fan Has Strong Cooling Power", alt: "GOOJODOQ Turbo Mini Fan", href: "https://invl.me/clngv3z", img: "assets/images/platforms/shopee/Electronics/selec2.webp" },
    { title: "TECNO SPARK GO 3 Has 120Hz Display & 5000mAh Battery", alt: "TECNO SPARK GO 3", href: "https://invl.me/clngv40", img: "assets/images/platforms/shopee/Electronics/selec3.webp" },
    { title: "Orashare Capsule Powerbank Fits in Your Pocket", alt: "Orashare Capsule Powerbank", href: "https://invl.me/clngv42", img: "assets/images/platforms/shopee/Electronics/selec4.webp" },
    { title: "Cordless Rechargeable Fan Runs for Hours Anywhere", alt: "Cordless Rechargeable Fan", href: "https://invl.me/clngv43", img: "assets/images/platforms/shopee/Electronics/selec5.webp", imgClass: "pin-portrait" },
    { title: "HUAWEI Band 11 Makes Fitness Tracking Effortless", alt: "HUAWEI Band 11", href: "https://invl.me/clngv44", img: "assets/images/platforms/shopee/Electronics/selec6.webp" },
    { title: "Samsung Galaxy A25/A26 Delivers Smooth Everyday Performance", alt: "Samsung Galaxy A25/A26", href: "https://invl.me/clngv45", img: "assets/images/platforms/shopee/Electronics/selec7.webp" },
    { title: "Xiaomi Mi Pad Handles Gaming, Streaming & Multitasking", alt: "Xiaomi Mi Pad", href: "https://invl.me/clngv46", img: "assets/images/platforms/shopee/Electronics/selec8.webp" },
    { title: "Galaxy Tab S9 Is Built for Gaming & Productivity", alt: "Galaxy Tab S9", href: "https://invl.me/clngv48", img: "assets/images/platforms/shopee/Electronics/selec9.webp" },
    { title: "EMEET C60E Webcam Delivers Crisp 4K Video Quality", alt: "EMEET C60E Webcam", href: "https://invl.me/clngv49", img: "assets/images/platforms/shopee/Electronics/selec10.webp" }
  ],
  shopee_health: [
    { title: "Originote Ceramella Sunscreen SPF50 Is a Bestseller", alt: "Originote Ceramella Sunscreen SPF50", href: "https://invl.me/clngv4i", img: "assets/images/platforms/shopee/Health/sheal1.webp" },
    { title: "SKINEVER Sunscreen Lotion Is Buy 1 Take 1", alt: "SKINEVER Sunscreen Lotion", href: "https://invl.me/clngv4j", img: "assets/images/platforms/shopee/Health/sheal2.webp" },
    { title: "Luxe Organix Maxshield Sunscreen Protects Face & Body", alt: "Luxe Organix Maxshield Sunscreen", href: "https://invl.me/clngv4k", img: "assets/images/platforms/shopee/Health/sheal3.webp" },
    { title: "MinoxiPlus 5% Helps Support Hair Growth Routine", alt: "MinoxiPlus 5%", href: "https://invl.me/clngv4m", img: "assets/images/platforms/shopee/Health/sheal4.webp" },
    { title: "Kérastase Genesis Serum Helps Reduce Hair Fall", alt: "Kérastase Genesis Serum", href: "https://invl.me/clngv4n", img: "assets/images/platforms/shopee/Health/sheal5.webp" },
    { title: "Black Sesame Hair Serum Supports Healthier Hair Growth", alt: "Black Sesame Hair Serum", href: "https://invl.me/clngv4o", img: "assets/images/platforms/shopee/Health/sheal6.webp" },
    { title: "Bodywise Rosemary Serum Supports Stronger-Looking Hair", alt: "Bodywise Rosemary Serum", href: "https://invl.me/clngv4r", img: "assets/images/platforms/shopee/Health/sheal7.webp" },
    { title: "Rogaine 5% Foam Supports Hair Regrowth Routine", alt: "Rogaine 5% Foam", href: "https://invl.me/clngv4x", img: "assets/images/platforms/shopee/Health/sheal8.webp" },
    { title: "Dermorepubliq Niacinamide Serum Helps Brighten Skin", alt: "Dermorepubliq Niacinamide Serum", href: "https://invl.me/clngv4y", img: "assets/images/platforms/shopee/Health/sheal9.webp" },
    { title: "Dermorepubliq Glycolic Toner Helps Smooth & Refresh Skin", alt: "Dermorepubliq Glycolic Toner", href: "https://invl.me/clngv4z", img: "assets/images/platforms/shopee/Health/sheal10.webp" }
  ],
  shopee_groceries: [
    { title: "DUJOSOO Black Coffee Has High Protein & Zero Fat", alt: "DUJOSOO Black Coffee", href: "https://invl.me/clngv5l", img: "assets/images/platforms/shopee/Groceries/scons1.webp" },
    { title: "Mood Food Peanut Butter Packs High Protein Energy", alt: "Mood Food Peanut Butter", href: "https://invl.me/clngv5m", img: "assets/images/platforms/shopee/Groceries/scons2.webp" },
    { title: "ON Gold Standard Whey Is a Top Protein Pick", alt: "ON Gold Standard Whey", href: "https://invl.me/clngv5n", img: "assets/images/platforms/shopee/Groceries/scons3.webp" },
    { title: "Blitz Protein Bars Make High Protein Snacking Easy", alt: "Blitz Protein Bars", href: "https://invl.me/clngv5o", img: "assets/images/platforms/shopee/Groceries/scons4.webp" },
    { title: "Anchor Protein Plus Milk Is Buy 2 Take 1", alt: "Anchor Protein Plus Milk", href: "https://invl.me/clngv5q", img: "assets/images/platforms/shopee/Groceries/scons5.webp" },
    { title: "Pure Form Creatine Helps Support Strength & Muscle Growth", alt: "Pure Form Creatine", href: "https://invl.me/clngv5r", img: "assets/images/platforms/shopee/Groceries/scons6.webp" },
    { title: "ON Creatine Powder Supports Strength & Workout Performance", alt: "ON Creatine Powder", href: "https://invl.me/clngv5s", img: "assets/images/platforms/shopee/Groceries/scons7.webp" },
    { title: "ATC Fish Oil Supports Everyday Wellness & Nutrition", alt: "ATC Fish Oil", href: "https://invl.me/clngv5t", img: "assets/images/platforms/shopee/Groceries/scons8.webp" },
    { title: "VTEAY Omega 3 Combines Fish Oil & Collagen Support", alt: "VTEAY Omega 3", href: "https://invl.me/clngv5u", img: "assets/images/platforms/shopee/Groceries/scons9.webp" },
    { title: "Herbalife F1 Shake Makes High Protein Nutrition Easy", alt: "Herbalife F1 Shake", href: "https://invl.me/clngv5v", img: "assets/images/platforms/shopee/Groceries/scons10.webp" }
  ],
};


// ══════════════════════════════════════════════════════════════
//  CARD RENDERER
// ══════════════════════════════════════════════════════════════

function renderCards(containerId, productArray, platform) {
  const container = document.getElementById(containerId);
  if (!container || !productArray) return;
  container.innerHTML = productArray.map(p => `
    <a class="card" href="${p.href}" target="_blank" rel="noopener nofollow">
      <img class="card-img${p.imgClass ? ' ' + p.imgClass : ''}" src="${p.img}" alt="${p.alt}" loading="lazy" width="300" height="300" />
      <div class="card-body">
        <h3>${p.title}</h3>
        <div class="card-footer">
          <span class="card-cta">View on ${platform} <span>→</span></span>
          <button class="save-btn" aria-label="Save product" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    </a>
  `).join('');
}


// ══════════════════════════════════════════════════════════════
//  RENDER ALL CARDS
// ══════════════════════════════════════════════════════════════

renderCards('shopee-best-1',       PRODUCTS.shopee_best_1,       'Shopee');
renderCards('shopee-best-2',       PRODUCTS.shopee_best_2,       'Shopee');
renderCards('shopee-fashion',      PRODUCTS.shopee_fashion,      'Shopee');
renderCards('shopee-electronics',  PRODUCTS.shopee_electronics,  'Shopee');
renderCards('shopee-health',       PRODUCTS.shopee_health,       'Shopee');
renderCards('shopee-groceries',    PRODUCTS.shopee_groceries,    'Shopee');


// ══════════════════════════════════════════════════════════════
//  CARD RANDOMIZATION
// ══════════════════════════════════════════════════════════════

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleContainer(container) {
  if (!container) return;
  const cards = Array.from(container.children);
  if (cards.length < 2) return;
  const shuffled = shuffle(cards);
  const fragment = document.createDocumentFragment();
  shuffled.forEach(card => fragment.appendChild(card));
  container.innerHTML = '';
  container.appendChild(fragment);
}

function shuffleAllCards() {
  document.querySelectorAll('.shop-section').forEach(section => {
    const grids = section.querySelectorAll('.slider-grid');
    if (grids.length < 2) return;

    const allCards = [];
    grids.forEach(grid => allCards.push(...Array.from(grid.children)));

    const shuffledCards = shuffle(allCards);
    grids.forEach(grid => { grid.innerHTML = ''; });

    const maxPerRow = 10;
    shuffledCards.forEach((card, index) => {
      const rowIndex = Math.floor(index / maxPerRow);
      if (grids[rowIndex]) grids[rowIndex].appendChild(card);
    });
  });

  document.querySelectorAll('.category-cards').forEach(grid => {
    shuffleContainer(grid);
  });
}


// ══════════════════════════════════════════════════════════════
//  CATEGORY FILTER
// ══════════════════════════════════════════════════════════════

function toggleCategoryPanel(label) {
  const section    = label.closest('.shop-section');
  const panel      = section.querySelector('.category-panel');
  const catSection = label.closest('.category-section');
  const isOpen     = panel.classList.contains('open');

  if (isOpen) {
    const anim = panel.animate(
      [{ maxHeight: panel.scrollHeight + 'px' }, { maxHeight: '0px' }],
      { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => {
      panel.classList.remove('open');
      panel.style.maxHeight = '';
      anim.cancel();
    };
    section.querySelectorAll('.cat-tag').forEach(t => t.classList.remove('active'));
    section.querySelectorAll('.category-cards').forEach(g => g.classList.remove('active'));
    catSection.classList.remove('cat-open');
  } else {
    panel.classList.add('open');
    catSection.classList.add('cat-open');
    panel.animate(
      [{ maxHeight: '0px' }, { maxHeight: panel.scrollHeight + 'px' }],
      { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    ).onfinish = () => { panel.style.maxHeight = '4000px'; };
  }
}

function filterCategory(tag, category) {
  const section  = tag.closest('.shop-section');
  const allTags  = section.querySelectorAll('.cat-tag');
  const allGrids = section.querySelectorAll('.category-cards');
  const panel    = section.querySelector('.category-panel');
  const isActive = tag.classList.contains('active');

  allTags.forEach(t  => t.classList.remove('active'));
  allGrids.forEach(g => g.classList.remove('active'));

  if (isActive) {
    const anim = panel.animate(
      [{ maxHeight: panel.scrollHeight + 'px' }, { maxHeight: '0px' }],
      { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );
    anim.onfinish = () => {
      panel.classList.remove('open');
      panel.style.maxHeight = '';
      anim.cancel();
    };
    const catSection = section.querySelector('.category-section');
    if (catSection) catSection.classList.remove('cat-open');
    return;
  }

  tag.classList.add('active');
  const target = section.querySelector(`.category-cards[data-category="${category}"]`);
  if (target) target.classList.add('active');

  if (!panel.classList.contains('open')) {
    panel.classList.add('open');
    const catSection = section.querySelector('.category-section');
    if (catSection) catSection.classList.add('cat-open');
    panel.animate(
      [{ maxHeight: '0px' }, { maxHeight: panel.scrollHeight + 'px' }],
      { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    ).onfinish = () => { panel.style.maxHeight = '4000px'; };
  }
}

function routeTo(target) {
  let sectionEl, categoryKey;

  if (target === 'shopee-best') {
    sectionEl = document.querySelector('.shop-section[data-section="shopee"]');
  } else if (target === 'shopee-fashion') {
    sectionEl = document.querySelector('.shop-section[data-section="shopee"]');
    categoryKey = 'fashion';
  } else if (target === 'shopee-electronics') {
    sectionEl = document.querySelector('.shop-section[data-section="shopee"]');
    categoryKey = 'electronics';
  } else if (target === 'shopee-health') {
    sectionEl = document.querySelector('.shop-section[data-section="shopee"]');
    categoryKey = 'health';
  } else if (target === 'shopee-groceries') {
    sectionEl = document.querySelector('.shop-section[data-section="shopee"]');
    categoryKey = 'groceries';
  }

  if (!sectionEl) return;

  if (categoryKey) {
    const panel      = sectionEl.querySelector('.category-panel');
    const catSection = sectionEl.querySelector('.category-section');
    if (!panel.classList.contains('open')) {
      panel.classList.add('open');
      if (catSection) catSection.classList.add('cat-open');
      panel.animate(
        [{ maxHeight: '0px' }, { maxHeight: panel.scrollHeight + 'px' }],
        { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
      ).onfinish = () => { panel.style.maxHeight = '4000px'; };
    }
    setTimeout(() => {
      const tag = sectionEl.querySelector(`.cat-tag[onclick*="${categoryKey}"]`);
      if (tag && !tag.classList.contains('active')) filterCategory(tag, categoryKey);
    }, 460);
  }

  setTimeout(() => {
    sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

function toggleSection(header) {
  // no-op: sections are always open; stub prevents console errors
}