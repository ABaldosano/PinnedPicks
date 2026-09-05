// ══════════════════════════════════════════════════════════════
//  SUPABASE CONFIG
//  The anon/public key is safe to expose here — it's rate-limited
//  and RLS-protected (read-only, active rows only). See README.
// ══════════════════════════════════════════════════════════════

const SUPABASE_URL      = 'https://jczhfwtvmwmemysazncl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjemhmd3R2bXdtZW15c2F6bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjI5MTQsImV4cCI6MjEwMDQ5ODkxNH0.nAKI1suIqpGFBjYZGdzBcXMDUGplVyhMWb4sJnTtjBc';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  renderSkeletons();
  loadProducts();
});

const PRODUCTS = {};

async function loadProducts() {
  try {
    const { data, error } = await sb
      .from('products')
      .select('platform, section, category, title, alt, href, img, img_class, sort_order')
      .eq('active', true)
      .order('section', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) throw error;

    (data || []).forEach(row => {
      const key = `${row.platform}_${row.section}`;
      if (!PRODUCTS[key]) PRODUCTS[key] = [];
      PRODUCTS[key].push({
        title: row.title,
        alt: row.alt,
        href: row.href,
        img: row.img,
        ...(row.img_class ? { imgClass: row.img_class } : {})
      });
    });

    renderAllCards();

    initTouchSwipe();
    shuffleAllCards();
    initAutoSlider();
    initSavedPins();
    if (window.rebuildSearchIndex) window.rebuildSearchIndex();
    openDefaultCategories();

  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
    clearSkeletons();
  }
}


// ══════════════════════════════════════════════════════════════
//  SKELETON LOADER
//  Shown immediately on load, before the Supabase fetch resolves.
//  renderCards() overwrites these containers' innerHTML once real
//  data arrives, so no separate "clear" step is needed on success.
// ══════════════════════════════════════════════════════════════

const CARD_CONTAINER_IDS = [
  'shopee-best-1', 'shopee-best-2',
  'shopee-fashion', 'shopee-electronics', 'shopee-health', 'shopee-groceries'
];

function skeletonCardHTML() {
  return `
    <div class="card-skeleton">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-footer">
          <div class="skeleton-cta"></div>
          <div class="skeleton-save"></div>
        </div>
      </div>
    </div>
  `;
}

function renderSkeletons(count = 6) {
  CARD_CONTAINER_IDS.forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = skeletonCardHTML().repeat(count);
  });
}

function clearSkeletons() {
  CARD_CONTAINER_IDS.forEach(id => {
    const container = document.getElementById(id);
    if (container) container.innerHTML = '';
  });
}


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

function renderAllCards() {
  renderCards('shopee-best-1',       PRODUCTS.shopee_best_1,       'Shopee');
  renderCards('shopee-best-2',       PRODUCTS.shopee_best_2,       'Shopee');
  renderCards('shopee-fashion',      PRODUCTS.shopee_fashion,      'Shopee');
  renderCards('shopee-electronics',  PRODUCTS.shopee_electronics,  'Shopee');
  renderCards('shopee-health',       PRODUCTS.shopee_health,       'Shopee');
  renderCards('shopee-groceries',    PRODUCTS.shopee_groceries,    'Shopee');
}


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

function filterCategory(tag, category, animate = true) {
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

    if (animate) {
      panel.animate(
        [{ maxHeight: '0px' }, { maxHeight: panel.scrollHeight + 'px' }],
        { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
      ).onfinish = () => { panel.style.maxHeight = '4000px'; };
    } else {
      panel.style.maxHeight = '4000px';
    }
  }
}


// ══════════════════════════════════════════════════════════════
//  DEFAULT CATEGORY — opens "Fashion & Apparel" on load
// ══════════════════════════════════════════════════════════════

function openDefaultCategories() {
  document.querySelectorAll('.shop-section').forEach(section => {
    const tag = section.querySelector('.cat-tag[onclick*="fashion"]');
    if (tag && !tag.classList.contains('active')) filterCategory(tag, 'fashion', false);
  });
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