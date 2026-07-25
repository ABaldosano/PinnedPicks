// ══════════════════════════════════════════════════════════════
//  SAVED PINS — INDEX PAGE
//  Handles save/unsave on product cards.
//  Must run after renderCards() has built the DOM.
// ══════════════════════════════════════════════════════════════

function getSavedPins() {
  return JSON.parse(localStorage.getItem('savedPins')) || [];
}

function setSavedPins(pins) {
  localStorage.setItem('savedPins', JSON.stringify(pins));
}

function initSavedPins() {

  const savedPins = getSavedPins();

  document.querySelectorAll('.card').forEach(card => {

    const title   = card.querySelector('h3')?.textContent.trim();
    const href    = card.getAttribute('href');
    const imgRaw  = card.querySelector('.card-img')?.getAttribute('src') || '';
    const img     = imgRaw.startsWith('http') || imgRaw.startsWith('/')
                    ? imgRaw
                    : '/' + imgRaw;
    const saveBtn = card.querySelector('.save-btn');

    if (!title || !saveBtn) return;

    const alreadySaved = savedPins.some(pin => pin.title === title);
    if (alreadySaved) saveBtn.classList.add('saved');

    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let currentPins = getSavedPins();
      const exists    = currentPins.some(pin => pin.title === title);

      if (exists) {
        currentPins = currentPins.filter(pin => pin.title !== title);
        saveBtn.classList.remove('saved');
      } else {
        const category = card.closest('.category-cards')?.dataset.category || '';
        const panel    = card.closest('.category-panel')?.id || '';
        const platform  = 'Shopee';

        currentPins.push({ title, href, image: img, category, platform });
        saveBtn.classList.add('saved');
      }

      setSavedPins(currentPins);
    });

  });
}