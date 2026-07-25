// ══════════════════════════════════════════════════════════════
//  SEARCH SYSTEM
//  Depends on: PRODUCTS (products.js must load first)
// ══════════════════════════════════════════════════════════════

(function initSearch() {

  const PLATFORM_MAP = {
    shopee_best_1: 'Shopee', shopee_best_2: 'Shopee',
    shopee_fashion: 'Shopee', shopee_electronics: 'Shopee',
    shopee_health: 'Shopee', shopee_groceries: 'Shopee'
  };

  const CATEGORY_MAP = {
    shopee_fashion: 'Fashion', shopee_electronics: 'Electronics',
    shopee_health: 'Health & Beauty', shopee_groceries: 'Groceries'
  };

  let PRODUCT_INDEX = [];

  function buildIndex() {
    PRODUCT_INDEX = [];
    Object.keys(PRODUCTS).forEach(key => {
      const platform = PLATFORM_MAP[key] || '';
      const category = CATEGORY_MAP[key] || '';
      (PRODUCTS[key] || []).forEach(p => {
        PRODUCT_INDEX.push({
          title: p.title, alt: p.alt || '',
          href: p.href, img: p.img, imgClass: p.imgClass || '',
          platform, category,
          searchText: [p.title, p.alt, platform, category].join(' ').toLowerCase()
        });
      });
    });
  }

  function queryProducts(q) {
    if (!q || !q.trim()) return [];
    const terms = q.toLowerCase().trim().split(/\s+/);
    return PRODUCT_INDEX.filter(p => terms.every(t => p.searchText.includes(t)));
  }

  function platformClass(p) {
    return 'srp-shopee';
  }

  function isMobile() { return window.innerWidth <= 600; }

  // ── DOM refs ──
  const toggleBtn     = document.getElementById('searchToggleBtn');
  const inputWrapDesk = document.getElementById('searchInputWrap');
  const inputDesk     = document.getElementById('searchInputDesktop');
  const clearDesk     = document.getElementById('searchClearBtnDesktop');
  const overlayBar    = document.getElementById('searchOverlayBar');
  const inputMob      = document.getElementById('searchInput');
  const clearMob      = document.getElementById('searchClearBtn');
  const cancelMob     = document.getElementById('searchCancelBtn');
  const dropdown      = document.getElementById('searchDropdown');
  const scrim         = document.getElementById('searchScrim');
  const headerEl      = document.querySelector('header');
  const virtualPage   = document.getElementById('searchVirtualPage');
  const svpBackBtn    = document.getElementById('svpBackBtn');
  const svpInput      = document.getElementById('svpSearchInput');
  const svpGrid       = document.getElementById('svpGrid');
  const svpCount      = document.getElementById('svpCount');

  let desktopOpen = false;

  // ── Desktop open/close ──
  function openDesktop() {
    if (desktopOpen) {
      const q = inputDesk.value.trim();
      if (q) { openVirtualPage(q); return; }
      closeDesktop(); return;
    }
    desktopOpen = true;
    inputWrapDesk.classList.add('open');
    setTimeout(() => inputDesk.focus(), 40);
  }

  function closeDesktop() {
    desktopOpen = false;
    inputWrapDesk.classList.remove('open');
    hideDropdown();
    inputDesk.value = '';
    clearDesk.classList.remove('visible');
  }

  // ── Mobile open/close ──
  function openMobile() {
    if (window._navScrollLock) window._navScrollLock();
    headerEl.classList.add('header-hidden');
    overlayBar.classList.add('open');
    setTimeout(() => inputMob.focus(), 120);
  }

  function closeMobileSearch() {
    overlayBar.classList.remove('open');
    headerEl.classList.remove('header-hidden');
    if (window._navScrollUnlock) window._navScrollUnlock();
    hideDropdown();
    inputMob.value = '';
    clearMob.classList.remove('visible');
  }

  // ── Toggle button routes by viewport ──
  toggleBtn.addEventListener('click', () => {
    if (isMobile()) openMobile(); else openDesktop();
  });

  cancelMob.addEventListener('click', closeMobileSearch);
  scrim.addEventListener('click', () => {
    if (isMobile()) closeMobileSearch(); else closeDesktop();
  });

  document.addEventListener('click', e => {
    if (!isMobile() && desktopOpen) {
      const wrapper = document.getElementById('searchWrapper');
      if (!wrapper.contains(e.target)) closeDesktop();
    }
  });

  // ── Desktop input events ──
  inputDesk.addEventListener('input', () => {
    const q = inputDesk.value;
    clearDesk.classList.toggle('visible', q.length > 0);
    q.trim() ? renderDropdown(queryProducts(q)) : hideDropdown();
  });

  inputDesk.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const q = inputDesk.value.trim(); if (q) openVirtualPage(q); }
    if (e.key === 'Escape') closeDesktop();
  });

  clearDesk.addEventListener('click', () => {
    inputDesk.value = '';
    clearDesk.classList.remove('visible');
    hideDropdown();
    inputDesk.focus();
  });

  // ── Mobile input events ──
  inputMob.addEventListener('input', () => {
    const q = inputMob.value;
    clearMob.classList.toggle('visible', q.length > 0);
    q.trim() ? renderDropdown(queryProducts(q)) : hideDropdown();
  });

  inputMob.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const q = inputMob.value.trim(); if (q) openVirtualPage(q); }
    if (e.key === 'Escape') closeMobileSearch();
  });

  clearMob.addEventListener('click', () => {
    inputMob.value = '';
    clearMob.classList.remove('visible');
    hideDropdown();
    inputMob.focus();
  });

  // ── Dropdown ──
  function renderDropdown(results) {
    dropdown.innerHTML = results.length === 0
      ? `<div class="search-dropdown-header">No results</div>
         <div class="search-no-results">Nothing found. Try a different keyword.</div>`
      : `<div class="search-dropdown-header">${results.length} result${results.length !== 1 ? 's' : ''}</div>
         ${results.map(r => `
           <a class="search-result-item" href="${r.href}" target="_blank" rel="noopener nofollow">
             <img class="search-result-img" src="${r.img}" alt="${r.alt}" loading="lazy" />
             <div class="search-result-info">
               <span class="search-result-title">${r.title}</span>
               <span class="search-result-platform ${platformClass(r.platform)}">${r.platform}${r.category ? ' · ' + r.category : ''}</span>
             </div>
             <span class="search-result-arrow">→</span>
           </a>`).join('')}`;
    showDropdown();
  }

  function positionDropdown() {
    if (isMobile()) {
      dropdown.style.top   = '62px';
      dropdown.style.left  = '10px';
      dropdown.style.right = '10px';
      dropdown.style.width = 'auto';
    } else {
      const wrapper = document.getElementById('searchWrapper');
      const rect    = wrapper.getBoundingClientRect();
      dropdown.style.top   = (rect.bottom + 8) + 'px';
      dropdown.style.right = (window.innerWidth - rect.right) + 'px';
      dropdown.style.left  = 'auto';
      dropdown.style.width = '380px';
    }
  }

  function showDropdown() {
    positionDropdown();
    dropdown.classList.add('visible');
    scrim.classList.add('visible');
  }

  function hideDropdown() {
    dropdown.classList.remove('visible');
    scrim.classList.remove('visible');
  }

  // ── Virtual Page ──
  function openVirtualPage(q) {
    svpInput.value = q;
    renderVirtualGrid(q);
    virtualPage.classList.add('open');
    virtualPage.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (isMobile()) closeMobileSearch(); else closeDesktop();
    setTimeout(() => svpInput.focus(), 80);
  }

  function closeVirtualPage() {
    virtualPage.classList.remove('open');
    virtualPage.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderVirtualGrid(q) {
    const results = queryProducts(q);
    svpCount.innerHTML = q.trim()
      ? `<strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} for "${q.trim()}"`
      : `<strong>${PRODUCT_INDEX.length}</strong> total products`;

    svpGrid.innerHTML = results.length === 0
      ? `<div class="svp-empty" style="grid-column:1/-1">
           <div class="svp-empty-icon">&#9906;</div>
           <p class="svp-empty-title">No results found</p>
           <p class="svp-empty-sub">Try "bag", "shopee", or "fashion".</p>
         </div>`
      : results.map(r => `
          <a class="card" href="${r.href}" target="_blank" rel="noopener nofollow" aria-label="View ${r.title} on ${r.platform}" data-product="${r.title}" data-platform="${r.platform}" data-category="${r.category || ''}">
            <img class="card-img${r.imgClass ? ' ' + r.imgClass : ''}" src="${r.img}" alt="${r.alt}" loading="lazy" />
            <div class="card-body">
              <h3>${r.title}</h3>
              <div class="card-footer">
                <span class="card-cta">Check Price <span>→</span></span>
                <span class="search-result-platform ${platformClass(r.platform)}" style="font-size:0.65rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${r.platform}</span>
              </div>
            </div>
          </a>`).join('');
  }

  svpBackBtn.addEventListener('click', closeVirtualPage);
  svpInput.addEventListener('input', () => renderVirtualGrid(svpInput.value));
  svpInput.addEventListener('keydown', e => { if (e.key === 'Escape') closeVirtualPage(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (virtualPage.classList.contains('open')) closeVirtualPage();
      else if (isMobile()) closeMobileSearch();
      else closeDesktop();
    }
  });

  buildIndex();

})();