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