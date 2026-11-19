const Cart = {
  KEY: 'ensign_cart',
  get() { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); },

  add(item) {
    const items = this.get();
    const ex = items.find(i => i.key === item.key);
    if (ex) { ex.qty += item.qty; }
    else { items.push(item); }
    this.save(items);
    this.updateBadge();
  },

  remove(key) {
    this.save(this.get().filter(i => i.key !== key));
    this.updateBadge();
  },

  update(key, qty) {
    const items = this.get();
    const item = items.find(i => i.key === key);
    if (!item) return;
    if (qty < 1) { this.remove(key); return; }
    item.qty = qty;
    this.save(items);
    this.updateBadge();
  },

  count() { return this.get().reduce((n, i) => n + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = this.count();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },

  init() {
    document.addEventListener('DOMContentLoaded', () => this.updateBadge());
  }
};

Cart.init();

function addToCart() {
  const name    = document.querySelector('.vprod__title')?.textContent?.trim() || 'Product';
  const priceEl = document.querySelector('.vprod__price')?.textContent?.trim() || '£0';
  const price   = parseFloat(priceEl.replace(/[^0-9.]/g, '')) || 0;
  const variant = document.querySelector('.vprod__variant.active')?.textContent?.trim() || '';
  const bodyMat = document.querySelector('#bodyMat .vprod__mat.active span')?.textContent?.trim() || '';
  const image   = document.getElementById('vprodMainImg')?.src || '';
  const qty     = Math.max(1, parseInt(document.getElementById('qtyInput')?.value || '1'));
  const url     = location.pathname.split('/').pop() || location.href;
  const key     = [name, variant, bodyMat].filter(Boolean).join('|');

  Cart.add({ key, name, price, variant, bodyMat, image, url, qty });

  const btn = document.querySelector('.vprod__add-btn');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#16a34a';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1800);
  }
}
// Header: burger menu, mobile drop-downs, active link and product search.
const SITE_PRODUCTS = [
  ['Leadscrew Circular Slide Gate', 'valve-leadscrew-circular', 'Fabricated Valves'],
  ['Leadscrew Square Slide Gate', 'valve-leadscrew-square', 'Fabricated Valves'],
  ['Manual Circular Slide Gate', 'valve-manual-circular', 'Fabricated Valves'],
  ['Manual Square Slide Gate', 'valve-manual-square', 'Fabricated Valves'],
  ['Rack & Pinion Slide Gate', 'valve-rack-pinion', 'Fabricated Valves'],
  ['Fabricated Diverter Valve', 'fabricated-diverter-valve', 'Fabricated Valves'],
  ['Single Dump Valve', 'single-dump-valve', 'Fabricated Valves'],
  ['Double Dump Valve', 'double-dump-valve', 'Fabricated Valves'],
  ['Flap Valve', 'flap-valve', 'Fabricated Valves'],
  ['Actuator Square Louver Damper', 'actuator-square-louver-damper', 'Fabricated Valves'],
  ['Manual Square Louver Damper', 'valve-square-louver', 'Fabricated Valves'],
  ['Butterfly Damper Valve', 'valve-butterfly', 'Fabricated Valves'],
  ['Multi Blade Damper Valve', 'valve-multi-blade', 'Fabricated Valves'],
  ['Standard Welded Pipe Shoe', 'pipe-support-standard-welded-pipe-shoe', 'Pipe Supports'],
  ['Compact Welded Pipe Shoe', 'pipe-support-compact-welded-pipe-shoe', 'Pipe Supports'],
  ['Double Upright Pipe Shoe', 'pipe-support-double-upright-pipe-shoe', 'Pipe Supports'],
  ['Double Upright Pipe Shoe with Gussets', 'pipe-support-double-upright-with-gussets', 'Pipe Supports'],
  ['Double Upright Pipe Shoe with Clamps', 'pipe-support-double-upright-with-clamps', 'Pipe Supports'],
  ['Double Upright Pipe Shoe with Clamps and Gussets', 'pipe-support-double-upright-with-clamps-gussets', 'Pipe Supports'],
  ['Fabricated Clamp Shoe', 'pipe-support-fabricated-clamp-shoe', 'Pipe Supports'],
  ['Fabricated Clamp Shoe with Gussets', 'pipe-support-fabricated-clamp-shoe-with-gussets', 'Pipe Supports'],
  ['Fabricated Pipe Saddle', 'pipe-support-fabricated-pipe-saddle', 'Pipe Supports'],
  ['Lock Clamp Shoe', 'pipe-support-lock-clamp-shoe', 'Pipe Supports'],
  ['Split Beam Pipe Shoe', 'pipe-support-split-beam-pipe-shoe', 'Pipe Supports'],
  ['Split Beam Pipe Shoe with Clamps', 'pipe-support-split-beam-with-clamps', 'Pipe Supports'],
  ['Split Beam Pipe Shoe with Clamps and Gusset', 'pipe-support-split-beam-with-clamps-gusset', 'Pipe Supports'],
  ['Split Beam Pipe Shoe with U-Bolts', 'pipe-support-split-beam-with-u-bolts', 'Pipe Supports'],
  ['Split Beam Pipe Shoe with U-Bolts and Gussets', 'pipe-support-split-beam-with-u-bolts-gussets', 'Pipe Supports'],
  ['Saddle Mount', 'pipe-support-saddle-mount', 'Pipe Supports'],
  ['Wall Sleeve Clamp', 'pipe-support-wall-sleeve-clamp', 'Pipe Supports'],
  ['Wall Sleeve Flange', 'pipe-support-wall-sleeve-flange', 'Pipe Supports'],
  ...[15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300].map(n => [`Pipe Clips NB ${n}`, `pipe-clip-nb${n}`, 'Pipe Clips']),
  ['Standard Inspection Door', 'inspection-door-standard', 'Inspection Doors'],
  ['Single Bar Inspection Door', 'inspection-door-single-bar', 'Inspection Doors'],
  ['Double Bar Inspection Door', 'inspection-door-double-bar', 'Inspection Doors'],
  ['Bolted Inspection Door', 'inspection-door-bolted', 'Inspection Doors'],
  ['Spill Pallet 932', 'spill-pallet-932', 'Spill Pallets'],
  ['Spill Pallet 1245', 'spill-pallet-1245', 'Spill Pallets'],
  ['Spill Pallet 1252', 'spill-pallet-1252', 'Spill Pallets'],
  ['Spillage Decking', 'spill-pallet-spillage-decking', 'Spill Pallets'],
  ['Diesel Transport Tank 1000L', 'diesel-transport-tank-1000l', 'Diesel Tanks'],
  ['Diesel Transport Tank 2000L', 'diesel-transport-tank-2000l', 'Diesel Tanks'],
  ['Sliding Door', 'sliding-door', 'Sliding Doors'],
  ['Fabricated Valves', 'fabricated-valves', 'Category'],
  ['Pipe Support', 'pipe-support', 'Category'],
  ['Pipe Supports', 'pipe-supports', 'Category'],
  ['Pipe Clips', 'pipe-clips', 'Category'],
  ['Inspection Doors', 'inspection-doors', 'Category'],
  ['Spill Pallets', 'spill-pallets', 'Category'],
  ['Diesel Tanks', 'diesel-tanks', 'Category'],
  ['Sliding Doors', 'sliding-doors', 'Category']
];

function siteSearchMatches(q) {
  const words = q.toLowerCase().replace(/nb\s*(\d)/g, 'nb $1').split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return SITE_PRODUCTS.filter(([name, , cat]) => {
    const hay = (name + ' ' + cat).toLowerCase();
    return words.every(w => hay.includes(w));
  }).slice(0, 8);
}

function siteSearchGo(e) {
  e.preventDefault();
  const q = (document.getElementById('siteSearch')?.value || '').trim();
  const hit = siteSearchMatches(q);
  const active = document.querySelector('#siteSearchResults a.active');
  if (active) location.href = active.getAttribute('href');
  else if (hit.length) location.href = hit[0][1];
  else if (q) location.href = `contact?product=${encodeURIComponent(q)}`;
  return false;
}

(function () {
  function init() {
    const header = document.querySelector('.sh');
    const burger = document.querySelector('.sh__burger');
    if (!header) return;
    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.addEventListener('click', () => {
        const open = header.classList.toggle('nav-open');
        burger.setAttribute('aria-expanded', String(open));
      });
    }
    // On phones a category heading opens its list instead of following the link
    header.querySelectorAll('.sh__item--drop > .sh__link').forEach(link => {
      link.addEventListener('click', e => {
        if (!isMobile()) return;
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      });
    });
    window.addEventListener('resize', () => {
      if (!isMobile()) header.classList.remove('nav-open');
    });

    // Highlight the menu item for the current page
    const here = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    if (here) header.querySelectorAll('.sh__nav a').forEach(a => {
      if (a.getAttribute('href') === here) {
        a.classList.add('is-active');
        a.closest('.sh__item')?.querySelector('.sh__link')?.classList.add('is-active');
      }
    });

    // Live product search
    const input = document.getElementById('siteSearch');
    const list = document.getElementById('siteSearchResults');
    if (!input || !list) return;
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const render = () => {
      const q = input.value.trim();
      if (!q) { list.hidden = true; return; }
      const hits = siteSearchMatches(q);
      list.innerHTML = hits.length
        ? hits.map(([n, u, c]) => `<li><a href="${u}"><span>${esc(n)}</span><small>${esc(c)}</small></a></li>`).join('')
        : `<li class="sh__results-empty">No match. Press Enter to ask us for a quote for &ldquo;${esc(q)}&rdquo;.</li>`;
      list.hidden = false;
    };
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { list.hidden = true; return; }
      const items = [...list.querySelectorAll('a')];
      if (!items.length || !['ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      let i = items.findIndex(a => a.classList.contains('active'));
      items[i]?.classList.remove('active');
      i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[i].classList.add('active');
    });
    document.addEventListener('click', e => { if (!e.target.closest('.sh__search')) list.hidden = true; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// Pipe support pages have no prices: the chosen pipe size, material and quantity are
// sent to the contact form, which fills them into the enquiry.
function pickMat(btn) {
  document.querySelectorAll('#bodyMat .vprod__mat').forEach(b => {
    b.classList.toggle('active', b === btn);
    b.querySelector('.vprod__check').style.display = b === btn ? 'block' : 'none';
  });
  // A material with its own photo (data-img) also switches the gallery to it
  const thumb = btn.dataset.img && document.querySelector(`.vprod__thumb[src="${btn.dataset.img}"]`);
  if (thumb && typeof setImg === 'function') setImg(thumb);
}

function requestPipeQuote() {
  const params = new URLSearchParams({
    product:  document.querySelector('.vprod__title')?.textContent?.trim() || '',
    size:     document.getElementById('pipeSize')?.value?.trim() || '',
    material: document.querySelector('#bodyMat .vprod__mat.active span')?.textContent?.trim() || '',
    qty:      Math.max(1, parseInt(document.getElementById('qtyInput')?.value || '1') || 1)
  });
  location.href = `contact?${params}`;
}
