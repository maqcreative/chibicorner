/* =============================================
   ONLINE KART (KARTIFY) — MAIN APPLICATION JS
   ============================================= */

'use strict';

// ============================================
// STATE MANAGEMENT
// ============================================
const State = {
  cart: JSON.parse(localStorage.getItem('kart_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('kart_wishlist') || '[]'),
  theme: localStorage.getItem('kart_theme') || 'light',
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  maxPrice: 1500,
  minRating: 0,
  currentHeroSlide: 0,
  heroAutoplayTimer: null,
  quickViewProduct: null,
  checkoutStep: 1,
  appliedCoupon: null,
  modalQty: 1,
};

// ============================================
// DOM REFERENCES
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let DOM = {};

function cacheDOM() {
  DOM = {
    body: document.body,
    searchInput: $('#searchInput'),
    searchClear: $('#searchClearBtn'),
    searchDrop: $('#searchResultsDrop'),
    cartBtn: $('#cartBtn'),
    wishBtn: $('#wishlistBtn'),
    cartCount: $('#cartCount'),
    wishCount: $('#wishlistCount'),
    themeToggle: $('#themeToggle'),
    mobileMenuBtn: $('#mobileMenuBtn'),
    overlay: $('#mainOverlay'),
    cartDrawer: $('#cartDrawer'),
    cartClose: $('#cartCloseBtn'),
    cartItemsList: $('#cartItemsList'),
    cartEmpty: $('#cartEmpty'),
    cartSummaryBlock: $('#cartSummaryBlock'),
    subtotalEl: $('#summarySubtotal'),
    discountRow: $('#summaryDiscountRow'),
    discountEl: $('#summaryDiscount'),
    shippingEl: $('#summaryShipping'),
    taxEl: $('#summaryTax'),
    totalEl: $('#summaryTotal'),
    couponInput: $('#couponInput'),
    applyCouponBtn: $('#applyCouponBtn'),
    couponMsg: $('#couponMsg'),
    checkoutBtn: $('#checkoutBtn'),
    wishlistDrawer: $('#wishlistDrawer'),
    wishlistClose: $('#wishlistCloseBtn'),
    wishlistItems: $('#wishlistItemsList'),
    wishlistEmpty: $('#wishlistEmpty'),
    modalOverlay: $('#quickViewOverlay'),
    quickViewModal: $('#quickViewModal'),
    modalClose: $('#modalCloseBtn'),
    modalImg: $('#modalImg'),
    modalBadge: $('#modalBadge'),
    modalName: $('#modalProductName'),
    modalRating: $('#modalRating'),
    modalPrice: $('#modalPrice'),
    modalOrigPrice: $('#modalOrigPrice'),
    modalSaveTag: $('#modalSaveTag'),
    modalDesc: $('#modalDesc'),
    modalSpecs: $('#modalSpecs'),
    modalQtyVal: $('#modalQtyVal'),
    modalQtyDec: $('#modalQtyDec'),
    modalQtyInc: $('#modalQtyInc'),
    modalAtcBtn: $('#modalAtcBtn'),
    modalWishBtn: $('#modalWishBtn'),
    productsGrid: $('#productsGrid'),
    resultsCount: $('#resultsCount'),
    sortSelect: $('#sortSelect'),
    priceRange: $('#priceRange'),
    priceMaxLabel: $('#priceMaxLabel'),
    filterCatBtns: $$('.filter-cat-btn'),
    catNavBtns: $$('.cat-nav-btn'),
    ratingRadios: $$('input[name="rating"]'),
    filterResetBtn: $('#filterResetBtn'),
    mobileFilterBtn: $('#mobileFilterBtn'),
    filterDrawer: $('#filterDrawer'),
    filterDrawerClose: $('#filterDrawerClose'),
    heroTrack: $('#heroSlidesTrack'),
    heroDots: $$('.hero-dot'),
    heroPrev: $('#heroPrev'),
    heroNext: $('#heroNext'),
    checkoutOverlay: $('#checkoutOverlay'),
    checkoutModal: $('#checkoutModal'),
    checkoutClose: $('#checkoutCloseBtn'),
    checkoutStepDots: $$('.step-dot'),
    checkoutStepLines: $$('.step-line'),
    checkoutSteps: $$('.checkout-step'),
    checkoutBackBtn: $('#checkoutBackBtn'),
    checkoutNextBtn: $('#checkoutNextBtn'),
    orderConfirmation: $('#orderConfirmation'),
    orderIdEl: $('#orderIdEl'),
    continueShopBtn: $('#continueShopBtn'),
    toastContainer: $('#toastContainer'),
    bottomNavBtns: $$('.bottom-nav-btn'),
    bottomCartCount: $('#bottomCartCount'),
    newsletterForm: $('#newsletterForm'),
    mobileSearchRow: $('#mobileSearchRow'),
  };
}

// ============================================
// THEME
// ============================================
function applyTheme(theme) {
  DOM.body.setAttribute('data-theme', theme);
  localStorage.setItem('kart_theme', theme);
  State.theme = theme;
}

function toggleTheme() {
  applyTheme(State.theme === 'light' ? 'dark' : 'light');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success', duration = 3000) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ============================================
// RIPPLE EFFECT
// ============================================
function addRipple(btn, e) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left) + 'px';
  ripple.style.top = (e.clientY - rect.top) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ============================================
// CART LOGIC
// ============================================
function saveCart() {
  localStorage.setItem('kart_cart', JSON.stringify(State.cart));
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = State.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    State.cart.push({ id: productId, qty });
  }
  saveCart();
  renderCart();
  updateBadges();
  showToast(`🛒 "${product.name.slice(0, 30)}..." added to cart!`, 'success');
  bumpBadge(DOM.cartCount);
  bumpBadge(DOM.bottomCartCount);
}

function removeFromCart(productId) {
  State.cart = State.cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
  updateBadges();
}

function updateQty(productId, delta) {
  const item = State.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); renderCart(); updateBadges(); }
}

function getCartTotal() {
  return State.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function getShipping(subtotal) {
  if (!State.appliedCoupon) return subtotal >= 100 ? 0 : 9.99;
  if (State.appliedCoupon.freeShipping) return 0;
  const afterDiscount = subtotal * (1 - State.appliedCoupon.discount);
  return afterDiscount >= 100 ? 0 : 9.99;
}

function renderCart() {
  const hasItems = State.cart.length > 0;
  if (DOM.cartEmpty) DOM.cartEmpty.style.display = hasItems ? 'none' : 'flex';
  if (DOM.cartSummaryBlock) DOM.cartSummaryBlock.style.display = hasItems ? 'block' : 'none';
  if (!hasItems) { if (DOM.cartItemsList) DOM.cartItemsList.innerHTML = ''; return; }

  DOM.cartItemsList.innerHTML = State.cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item" id="cart-item-${item.id}">
        <img src="${p.image}" alt="${p.name}" class="cart-item-img" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="updateQty('${p.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${p.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-del" onclick="removeFromCart('${p.id}')" title="Remove item" aria-label="Remove ${p.name}">🗑️</button>
      </div>`;
  }).join('');

  renderOrderSummary();
}

function renderOrderSummary() {
  const subtotal = getCartTotal();
  const coupon = State.appliedCoupon;
  let discountAmt = 0;

  if (coupon && coupon.discount) {
    if (!coupon.minSpend || subtotal >= coupon.minSpend) {
      discountAmt = subtotal * coupon.discount;
    }
  }

  const afterDiscount = subtotal - discountAmt;
  const shipping = getShipping(subtotal);
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  if (DOM.subtotalEl) DOM.subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (DOM.discountRow) {
    DOM.discountRow.style.display = discountAmt > 0 ? 'flex' : 'none';
    if (DOM.discountEl) DOM.discountEl.textContent = `-$${discountAmt.toFixed(2)}`;
  }

  if (DOM.shippingEl) DOM.shippingEl.textContent = shipping === 0 ? 'FREE 🎉' : `$${shipping.toFixed(2)}`;
  if (DOM.taxEl) DOM.taxEl.textContent = `$${tax.toFixed(2)}`;
  if (DOM.totalEl) DOM.totalEl.textContent = `$${total.toFixed(2)}`;
}

// ============================================
// WISHLIST LOGIC
// ============================================
function saveWishlist() {
  localStorage.setItem('kart_wishlist', JSON.stringify(State.wishlist));
}

function toggleWishlist(productId) {
  const idx = State.wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);
  if (idx > -1) {
    State.wishlist.splice(idx, 1);
    showToast(`💔 Removed from wishlist`, 'info');
  } else {
    State.wishlist.push(productId);
    showToast(`❤️ "${product ? product.name.slice(0, 28) + '...' : ''}" saved to wishlist!`, 'success');
    bumpBadge(DOM.wishCount);
  }
  saveWishlist();
  renderWishlist();
  updateBadges();
  // Update any visible wishlist heart buttons
  updateWishlistBtns();
}

function updateWishlistBtns() {
  $$('.wishlist-btn-card').forEach(btn => {
    const pid = btn.dataset.pid;
    if (State.wishlist.includes(pid)) {
      btn.textContent = '❤️';
      btn.classList.add('in-wishlist');
    } else {
      btn.textContent = '🤍';
      btn.classList.remove('in-wishlist');
    }
  });
  if (DOM.modalWishBtn && State.quickViewProduct) {
    const inW = State.wishlist.includes(State.quickViewProduct.id);
    DOM.modalWishBtn.textContent = inW ? '❤️' : '🤍';
  }
}

function renderWishlist() {
  const hasItems = State.wishlist.length > 0;
  if (DOM.wishlistEmpty) DOM.wishlistEmpty.style.display = hasItems ? 'none' : 'flex';
  if (!hasItems) { if (DOM.wishlistItems) DOM.wishlistItems.innerHTML = ''; return; }

  DOM.wishlistItems.innerHTML = State.wishlist.map(pid => {
    const p = PRODUCTS.find(pr => pr.id === pid);
    if (!p) return '';
    return `
      <div class="wishlist-item">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${p.name}</div>
          <div class="wishlist-item-price">$${p.price.toFixed(2)}</div>
          <div class="wishlist-actions">
            <button class="move-to-cart-btn" onclick="moveWishToCart('${p.id}')">🛒 Add to Cart</button>
            <button class="remove-wish-btn" onclick="toggleWishlist('${p.id}')">Remove</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function moveWishToCart(productId) {
  addToCart(productId);
  State.wishlist = State.wishlist.filter(id => id !== productId);
  saveWishlist();
  renderWishlist();
  updateBadges();
  updateWishlistBtns();
}

// ============================================
// BADGES
// ============================================
function updateBadges() {
  const cartCount = State.cart.reduce((sum, i) => sum + i.qty, 0);
  const wishCount = State.wishlist.length;

  [DOM.cartCount, DOM.bottomCartCount].forEach(el => {
    if (el) {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'flex' : 'none';
    }
  });
  if (DOM.wishCount) {
    DOM.wishCount.textContent = wishCount;
    DOM.wishCount.style.display = wishCount > 0 ? 'flex' : 'none';
  }
}

function bumpBadge(el) {
  if (!el) return;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

// ============================================
// DRAWER CONTROLS
// ============================================
function openCartDrawer() {
  DOM.cartDrawer.classList.add('open');
  DOM.overlay.classList.add('active');
  DOM.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  DOM.cartDrawer.classList.remove('open');
  closeOverlayIfNone();
}

function openWishlistDrawer() {
  DOM.wishlistDrawer.classList.add('open');
  DOM.overlay.classList.add('active');
  DOM.body.style.overflow = 'hidden';
}

function closeWishlistDrawer() {
  DOM.wishlistDrawer.classList.remove('open');
  closeOverlayIfNone();
}

function openFilterDrawer() {
  DOM.filterDrawer.classList.add('open');
  DOM.overlay.classList.add('active');
  DOM.body.style.overflow = 'hidden';
}

function closeFilterDrawer() {
  DOM.filterDrawer.classList.remove('open');
  closeOverlayIfNone();
}

function closeOverlayIfNone() {
  if (!DOM.cartDrawer.classList.contains('open') &&
      !DOM.wishlistDrawer.classList.contains('open') &&
      !DOM.filterDrawer.classList.contains('open')) {
    DOM.overlay.classList.remove('active');
    DOM.body.style.overflow = '';
  }
}

function closeAllDrawers() {
  closeCartDrawer();
  closeWishlistDrawer();
  closeFilterDrawer();
}

// ============================================
// PRODUCT GRID RENDERING
// ============================================
function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getDiscountPct(price, orig) {
  return Math.round((1 - price / orig) * 100);
}

function getFilteredProducts() {
  let results = [...PRODUCTS];

  // Category filter
  if (State.activeCategory !== 'all') {
    results = results.filter(p => p.category === State.activeCategory);
  }

  // Search filter
  if (State.searchQuery.trim()) {
    const q = State.searchQuery.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Price filter
  results = results.filter(p => p.price <= State.maxPrice);

  // Rating filter
  if (State.minRating > 0) {
    results = results.filter(p => p.rating >= State.minRating);
  }

  // Sort
  switch (State.sortBy) {
    case 'price_asc':  results.sort((a, b) => a.price - b.price); break;
    case 'price_desc': results.sort((a, b) => b.price - a.price); break;
    case 'rating':     results.sort((a, b) => b.rating - a.rating); break;
    case 'newest':     results.sort((a, b) => b.id.localeCompare(a.id)); break;
    default: break; // featured: default order
  }

  return results;
}

function renderProducts() {
  const products = getFilteredProducts();
  if (DOM.resultsCount) {
    DOM.resultsCount.innerHTML = `Showing <strong>${products.length}</strong> of <strong>${PRODUCTS.length}</strong> products`;
  }

  if (!DOM.productsGrid) return;

  if (products.length === 0) {
    DOM.productsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No Products Found</h3>
        <p>Try adjusting your filters or search term.</p>
      </div>`;
    return;
  }

  DOM.productsGrid.innerHTML = products.map(p => {
    const discPct = getDiscountPct(p.price, p.originalPrice);
    const inWish = State.wishlist.includes(p.id);
    const badgeClass = 'badge-' + p.badge.replace(' ', '.');
    return `
      <div class="product-card" data-pid="${p.id}" onclick="openQuickView('${p.id}')">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="product-badge ${badgeClass}">${p.badge}</span>
          <span class="product-discount-tag">-${discPct}%</span>
          <button class="wishlist-btn-card ${inWish ? 'in-wishlist' : ''}"
                  data-pid="${p.id}"
                  onclick="event.stopPropagation(); toggleWishlist('${p.id}')"
                  title="${inWish ? 'Remove from wishlist' : 'Add to wishlist'}"
                  aria-label="${inWish ? 'Remove from wishlist' : 'Add to wishlist'}">
            ${inWish ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="product-info">
          <span class="product-cat-tag">${p.categoryName}</span>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">
            <span class="stars">${getStars(p.rating)}</span>
            <span class="rating-val">${p.rating}</span>
            <span class="rating-cnt">(${p.reviewsCount.toLocaleString()})</span>
          </div>
          <div class="product-price">
            <span class="price-current">$${p.price.toFixed(2)}</span>
            <span class="price-original">$${p.originalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div class="product-card-footer">
          <button class="add-cart-btn" data-pid="${p.id}"
                  onclick="event.stopPropagation(); handleAddToCart(this, '${p.id}')"
                  aria-label="Add ${p.name} to cart">
            🛒 Add to Cart
          </button>
        </div>
      </div>`;
  }).join('');
}

function handleAddToCart(btn, productId) {
  addToCart(productId);
  const prev = btn.innerHTML;
  btn.classList.add('added');
  btn.innerHTML = '✅ Added!';
  btn.disabled = true;
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = prev;
    btn.disabled = false;
  }, 1800);
}

// ============================================
// SEARCH
// ============================================
function handleSearch(query) {
  State.searchQuery = query;
  renderProducts();
  renderSearchDrop(query);
  if (DOM.searchClear) DOM.searchClear.style.display = query ? 'block' : 'none';
}

function renderSearchDrop(query) {
  if (!query.trim() || !DOM.searchDrop) {
    DOM.searchDrop.classList.remove('show');
    return;
  }
  const q = query.toLowerCase();
  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
  ).slice(0, 5);

  if (matches.length === 0) {
    DOM.searchDrop.classList.remove('show');
    return;
  }

  DOM.searchDrop.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="openQuickView('${p.id}')">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <div class="res-name">${p.name}</div>
        <div class="res-price">$${p.price.toFixed(2)}</div>
      </div>
    </div>`).join('');
  DOM.searchDrop.classList.add('show');
}

// ============================================
// QUICK VIEW MODAL
// ============================================
function openQuickView(productId) {
  const p = PRODUCTS.find(pr => pr.id === productId);
  if (!p) return;
  State.quickViewProduct = p;
  State.modalQty = 1;

  const discPct = getDiscountPct(p.price, p.originalPrice);
  const inWish = State.wishlist.includes(p.id);
  const badgeClass = 'badge-' + p.badge.replace(' ', '.');

  if (DOM.modalImg) { DOM.modalImg.src = p.image; DOM.modalImg.alt = p.name; }
  if (DOM.modalBadge) DOM.modalBadge.innerHTML = `<span class="product-badge ${badgeClass}">${p.badge}</span>`;
  if (DOM.modalName) DOM.modalName.textContent = p.name;
  if (DOM.modalRating) DOM.modalRating.innerHTML = `<span class="stars">${getStars(p.rating)}</span> <strong>${p.rating}</strong> <span style="color:var(--text-muted)">(${p.reviewsCount.toLocaleString()} reviews)</span>`;
  if (DOM.modalPrice) DOM.modalPrice.textContent = `$${p.price.toFixed(2)}`;
  if (DOM.modalOrigPrice) DOM.modalOrigPrice.textContent = `$${p.originalPrice.toFixed(2)}`;
  if (DOM.modalSaveTag) DOM.modalSaveTag.textContent = `Save ${discPct}%`;
  if (DOM.modalDesc) DOM.modalDesc.textContent = p.description;
  if (DOM.modalSpecs) {
    DOM.modalSpecs.innerHTML = Object.entries(p.specs).map(([k, v]) => `
      <div class="spec-item">
        <div class="spec-key">${k}</div>
        <div class="spec-val">${v}</div>
      </div>`).join('');
  }
  if (DOM.modalQtyVal) DOM.modalQtyVal.textContent = State.modalQty;
  if (DOM.modalWishBtn) { DOM.modalWishBtn.textContent = inWish ? '❤️' : '🤍'; }

  DOM.modalOverlay.classList.add('active');
  DOM.body.style.overflow = 'hidden';
}

function closeQuickView() {
  DOM.modalOverlay.classList.remove('active');
  DOM.body.style.overflow = '';
  State.quickViewProduct = null;
}

// ============================================
// HERO CAROUSEL
// ============================================
const HERO_COUNT = 3;

function goToSlide(index) {
  State.currentHeroSlide = (index + HERO_COUNT) % HERO_COUNT;
  if (DOM.heroTrack) {
    DOM.heroTrack.style.transform = `translateX(-${State.currentHeroSlide * 100}%)`;
  }
  DOM.heroDots.forEach((dot, i) => dot.classList.toggle('active', i === State.currentHeroSlide));
}

function startHeroAutoplay() {
  State.heroAutoplayTimer = setInterval(() => {
    goToSlide(State.currentHeroSlide + 1);
  }, 4500);
}

function stopHeroAutoplay() {
  clearInterval(State.heroAutoplayTimer);
}

// ============================================
// FILTERS
// ============================================
function setCategory(cat) {
  State.activeCategory = cat;
  DOM.filterCatBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === cat));
  DOM.catNavBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === cat));
  renderProducts();
}

function resetFilters() {
  State.activeCategory = 'all';
  State.maxPrice = 1500;
  State.minRating = 0;
  State.sortBy = 'featured';
  State.searchQuery = '';
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.priceRange) DOM.priceRange.value = 1500;
  if (DOM.priceMaxLabel) DOM.priceMaxLabel.textContent = '$1500';
  if (DOM.sortSelect) DOM.sortSelect.value = 'featured';
  DOM.ratingRadios.forEach(r => r.checked = false);
  DOM.filterCatBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === 'all'));
  DOM.catNavBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.cat === 'all'));
  renderProducts();
  showToast('Filters reset!', 'info');
}

// ============================================
// COUPON
// ============================================
function applyCoupon() {
  const code = DOM.couponInput ? DOM.couponInput.value.trim().toUpperCase() : '';
  if (!code) { showToast('Please enter a coupon code', 'warning'); return; }

  const coupon = PROMO_COUPONS[code];
  if (!coupon) {
    if (DOM.couponMsg) { DOM.couponMsg.textContent = '❌ Invalid coupon code.'; DOM.couponMsg.className = 'coupon-msg error'; }
    showToast('Invalid coupon code!', 'error');
    return;
  }

  const subtotal = getCartTotal();
  if (coupon.minSpend && subtotal < coupon.minSpend) {
    if (DOM.couponMsg) {
      DOM.couponMsg.textContent = `⚠️ Minimum spend $${coupon.minSpend} required.`;
      DOM.couponMsg.className = 'coupon-msg error';
    }
    showToast(`Min. spend $${coupon.minSpend} required for this code.`, 'warning');
    return;
  }

  State.appliedCoupon = coupon;
  if (DOM.couponMsg) {
    DOM.couponMsg.textContent = `✅ Applied: ${coupon.label}`;
    DOM.couponMsg.className = 'coupon-msg success';
  }
  showToast(`Coupon "${code}" applied! ${coupon.label}`, 'success');
  renderOrderSummary();
}

// ============================================
// CHECKOUT FLOW
// ============================================
function updateCheckoutStepUI() {
  DOM.checkoutStepDots.forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 === State.checkoutStep);
    dot.classList.toggle('done', i + 1 < State.checkoutStep);
  });
  DOM.checkoutStepLines.forEach((line, i) => {
    line.classList.toggle('done', i + 1 < State.checkoutStep);
  });
  DOM.checkoutSteps.forEach((step, i) => {
    step.classList.toggle('active', i + 1 === State.checkoutStep);
  });
  if (DOM.checkoutBackBtn) {
    DOM.checkoutBackBtn.style.display = State.checkoutStep > 1 ? 'block' : 'none';
  }
  if (DOM.checkoutNextBtn) {
    if (State.checkoutStep === 2) {
      DOM.checkoutNextBtn.textContent = '💳 Place Order →';
    } else if (State.checkoutStep === 3) {
      DOM.checkoutNextBtn.style.display = 'none';
    } else {
      DOM.checkoutNextBtn.textContent = 'Next Step →';
      DOM.checkoutNextBtn.style.display = 'block';
    }
  }
}

function nextCheckoutStep() {
  if (State.checkoutStep === 1) {
    // Validate step 1
    const name = $('#shippingName') ? $('#shippingName').value.trim() : 'Test';
    const email = $('#shippingEmail') ? $('#shippingEmail').value.trim() : 'test@test.com';
    if (!name || !email) { showToast('Please fill in your name and email.', 'warning'); return; }
    State.checkoutStep = 2;
    updateCheckoutStepUI();
  } else if (State.checkoutStep === 2) {
    // Place order
    State.checkoutStep = 3;
    updateCheckoutStepUI();
    placeOrder();
  }
}

function prevCheckoutStep() {
  if (State.checkoutStep > 1) {
    State.checkoutStep--;
    updateCheckoutStepUI();
  }
}

function placeOrder() {
  const orderId = 'KART-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 9000 + 1000);
  if (DOM.orderIdEl) DOM.orderIdEl.textContent = orderId;

  // Gather form data
  const customerName  = ($('#shippingName')    ? $('#shippingName').value.trim()    : '') || 'Guest Customer';
  const customerEmail = ($('#shippingEmail')   ? $('#shippingEmail').value.trim()   : '') || 'guest@kartify.com';
  const customerPhone = ($('#shippingPhone')   ? $('#shippingPhone').value.trim()   : '') || '—';
  const address       = ($('#shippingAddr')    ? $('#shippingAddr').value.trim()    : '') || '—';
  const city          = ($('#shippingCity')    ? $('#shippingCity').value.trim()    : '') || '—';
  const zip           = ($('#shippingZip')     ? $('#shippingZip').value.trim()     : '') || '—';
  const country       = ($('#shippingCountry') ? $('#shippingCountry').value        : '') || 'us';
  const paymentEl     = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentEl ? paymentEl.value : 'card';

  // Build order snapshot
  const subtotal  = getCartTotal();
  const coupon    = State.appliedCoupon;
  let discountAmt = 0;
  if (coupon && coupon.discount) {
    if (!coupon.minSpend || subtotal >= coupon.minSpend) discountAmt = subtotal * coupon.discount;
  }
  const afterDiscount = subtotal - discountAmt;
  const shipping  = getShipping(subtotal);
  const tax       = afterDiscount * 0.08;
  const total     = afterDiscount + shipping + tax;

  const orderItems = State.cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return p ? { id: p.id, name: p.name, image: p.image, price: p.price, qty: item.qty, category: p.categoryName } : null;
  }).filter(Boolean);

  const order = {
    orderId,
    placedAt: new Date().toISOString(),
    status: 'Pending',
    customer: { name: customerName, email: customerEmail, phone: customerPhone },
    shipping: { address, city, zip, country },
    payment: paymentMethod,
    items: orderItems,
    summary: {
      subtotal: subtotal.toFixed(2),
      discount: discountAmt.toFixed(2),
      couponCode: coupon ? (DOM.couponInput ? DOM.couponInput.value.trim().toUpperCase() : '') : '',
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    }
  };

  // Persist to localStorage
  const existingOrders = JSON.parse(localStorage.getItem('kart_orders') || '[]');
  existingOrders.unshift(order);
  localStorage.setItem('kart_orders', JSON.stringify(existingOrders));

  // Clear cart
  State.cart = [];
  State.appliedCoupon = null;
  if (DOM.couponInput) DOM.couponInput.value = '';
  if (DOM.couponMsg) { DOM.couponMsg.textContent = ''; DOM.couponMsg.className = 'coupon-msg'; }
  saveCart();
  renderCart();
  updateBadges();
  if (DOM.checkoutNextBtn) DOM.checkoutNextBtn.style.display = 'none';
  if (DOM.checkoutBackBtn) DOM.checkoutBackBtn.style.display = 'none';
}

function openCheckout() {
  if (State.cart.length === 0) { showToast('Your cart is empty!', 'warning'); return; }
  closeCartDrawer();
  State.checkoutStep = 1;
  DOM.checkoutOverlay.classList.add('active');
  DOM.body.style.overflow = 'hidden';
  updateCheckoutStepUI();
}

function closeCheckout() {
  DOM.checkoutOverlay.classList.remove('active');
  DOM.body.style.overflow = '';
}

// ============================================
// EVENT LISTENERS
// ============================================
function bindEvents() {
  // Theme
  if (DOM.themeToggle) DOM.themeToggle.addEventListener('click', toggleTheme);

  // Search
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', e => handleSearch(e.target.value));
    DOM.searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { handleSearch(''); DOM.searchInput.value = ''; } });
  }
  if (DOM.searchClear) DOM.searchClear.addEventListener('click', () => { handleSearch(''); DOM.searchInput.value = ''; DOM.searchInput.focus(); });

  // Close search drop on outside click
  document.addEventListener('click', e => {
    if (DOM.searchDrop && !DOM.searchDrop.contains(e.target) && e.target !== DOM.searchInput) {
      DOM.searchDrop.classList.remove('show');
    }
  });

  // Cart
  if (DOM.cartBtn) DOM.cartBtn.addEventListener('click', openCartDrawer);
  if (DOM.cartClose) DOM.cartClose.addEventListener('click', closeCartDrawer);
  if (DOM.checkoutBtn) DOM.checkoutBtn.addEventListener('click', openCheckout);

  // Wishlist
  if (DOM.wishBtn) DOM.wishBtn.addEventListener('click', openWishlistDrawer);
  if (DOM.wishlistClose) DOM.wishlistClose.addEventListener('click', closeWishlistDrawer);

  // Overlay
  if (DOM.overlay) DOM.overlay.addEventListener('click', closeAllDrawers);

  // Filter sidebar & drawer
  DOM.filterCatBtns.forEach(btn => btn.addEventListener('click', () => setCategory(btn.dataset.cat)));
  DOM.catNavBtns.forEach(btn => btn.addEventListener('click', () => setCategory(btn.dataset.cat)));
  if (DOM.priceRange) {
    DOM.priceRange.addEventListener('input', e => {
      State.maxPrice = Number(e.target.value);
      if (DOM.priceMaxLabel) DOM.priceMaxLabel.textContent = `$${State.maxPrice}`;
      renderProducts();
    });
  }
  DOM.ratingRadios.forEach(radio => {
    radio.addEventListener('change', e => {
      State.minRating = Number(e.target.value);
      renderProducts();
    });
  });
  if (DOM.filterResetBtn) DOM.filterResetBtn.addEventListener('click', resetFilters);
  if (DOM.sortSelect) DOM.sortSelect.addEventListener('change', e => { State.sortBy = e.target.value; renderProducts(); });

  // Mobile filter drawer
  if (DOM.mobileFilterBtn) DOM.mobileFilterBtn.addEventListener('click', openFilterDrawer);
  if (DOM.filterDrawerClose) DOM.filterDrawerClose.addEventListener('click', closeFilterDrawer);

  // Hero Carousel
  if (DOM.heroPrev) DOM.heroPrev.addEventListener('click', () => { stopHeroAutoplay(); goToSlide(State.currentHeroSlide - 1); startHeroAutoplay(); });
  if (DOM.heroNext) DOM.heroNext.addEventListener('click', () => { stopHeroAutoplay(); goToSlide(State.currentHeroSlide + 1); startHeroAutoplay(); });
  DOM.heroDots.forEach((dot, i) => dot.addEventListener('click', () => { stopHeroAutoplay(); goToSlide(i); startHeroAutoplay(); }));

  // Quick View Modal
  if (DOM.modalClose) DOM.modalClose.addEventListener('click', closeQuickView);
  if (DOM.modalOverlay) DOM.modalOverlay.addEventListener('click', e => { if (e.target === DOM.modalOverlay) closeQuickView(); });
  if (DOM.modalQtyDec) DOM.modalQtyDec.addEventListener('click', () => { if (State.modalQty > 1) { State.modalQty--; if (DOM.modalQtyVal) DOM.modalQtyVal.textContent = State.modalQty; } });
  if (DOM.modalQtyInc) DOM.modalQtyInc.addEventListener('click', () => { State.modalQty++; if (DOM.modalQtyVal) DOM.modalQtyVal.textContent = State.modalQty; });
  if (DOM.modalAtcBtn) {
    DOM.modalAtcBtn.addEventListener('click', (e) => {
      if (!State.quickViewProduct) return;
      addToCart(State.quickViewProduct.id, State.modalQty);
      addRipple(DOM.modalAtcBtn, e);
      closeQuickView();
    });
  }
  if (DOM.modalWishBtn) {
    DOM.modalWishBtn.addEventListener('click', () => {
      if (!State.quickViewProduct) return;
      toggleWishlist(State.quickViewProduct.id);
    });
  }

  // Coupon
  if (DOM.applyCouponBtn) DOM.applyCouponBtn.addEventListener('click', applyCoupon);
  if (DOM.couponInput) DOM.couponInput.addEventListener('keydown', e => { if (e.key === 'Enter') applyCoupon(); });

  // Checkout
  if (DOM.checkoutOverlay) DOM.checkoutOverlay.addEventListener('click', e => { if (e.target === DOM.checkoutOverlay) closeCheckout(); });
  if (DOM.checkoutClose) DOM.checkoutClose.addEventListener('click', closeCheckout);
  if (DOM.checkoutNextBtn) DOM.checkoutNextBtn.addEventListener('click', nextCheckoutStep);
  if (DOM.checkoutBackBtn) DOM.checkoutBackBtn.addEventListener('click', prevCheckoutStep);
  if (DOM.continueShopBtn) DOM.continueShopBtn.addEventListener('click', closeCheckout);

  // Payment options
  $$('.payment-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      $$('.payment-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    });
  });

  // Mobile Bottom Nav
  DOM.bottomNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      DOM.bottomNavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (action === 'cart') openCartDrawer();
      else if (action === 'wishlist') openWishlistDrawer();
      else if (action === 'filter') openFilterDrawer();
    });
  });

  // Newsletter
  if (DOM.newsletterForm) {
    DOM.newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('🎉 Subscribed! Welcome to Kartify!', 'success');
      DOM.newsletterForm.reset();
    });
  }

  // Mobile menu btn (toggle search row)
  if (DOM.mobileMenuBtn) {
    DOM.mobileMenuBtn.addEventListener('click', () => {
      DOM.mobileMenuBtn.classList.toggle('open');
      if (DOM.mobileSearchRow) {
        DOM.mobileSearchRow.style.display =
          DOM.mobileSearchRow.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeCheckout();
      closeAllDrawers();
    }
  });
}

// ============================================
// INIT
// ============================================
function init() {
  cacheDOM();
  applyTheme(State.theme);
  renderProducts();
  renderCart();
  renderWishlist();
  updateBadges();
  bindEvents();
  goToSlide(0);
  startHeroAutoplay();
}

document.addEventListener('DOMContentLoaded', init);

// ============================================
// SECRET ADMIN ACCESS — Ctrl + Shift + A
// Also: click the store logo 5 times rapidly
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    showToast('🛡️ Opening Admin Panel…', 'info');
    setTimeout(() => window.open('admin.html', '_blank'), 800);
  }
});

// Logo click 5× secret access
let logoClickCount = 0;
let logoClickTimer = null;
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo, .site-logo, .brand-logo, header .logo-text, .nav-logo');
  if (!logo) return;
  logo.addEventListener('click', () => {
    logoClickCount++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 2000);
    if (logoClickCount >= 5) {
      logoClickCount = 0;
      showToast('🛡️ Opening Admin Panel…', 'info');
      setTimeout(() => window.open('admin.html', '_blank'), 800);
    }
  });
});
