# Kartify – Online Kart Website 🛒

A modern, fully responsive e-commerce website built with pure HTML5, CSS3 (Vanilla), and ES6+ JavaScript. Zero dependencies. Works in any browser.

## 🌐 View Locally

A Python server is already running on port 8000. Open your browser and visit:

> **http://localhost:8000**

Or simply double-click `index.html` to open it directly in your browser.

To restart the server manually:
```powershell
python -m http.server 8000
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 Dark / Light Mode | Toggle with the button in the header — persisted via localStorage |
| 🔍 Live Search | Instant product matching with auto-complete dropdown |
| 🎛️ Filters | Category, price range, and customer rating filters |
| 🔀 Sort | Featured, Price Low→High, Price High→Low, Highest Rated, Newest |
| 🛒 Cart Drawer | Slide-in cart with quantity controls, item removal |
| ❤️ Wishlist | Save products and move to cart in one click |
| 🔍 Quick View | Product detail modal with specs, quantity selector |
| 🏷️ Promo Codes | Working coupon system with order total recalculation |
| 💳 Checkout | Multi-step checkout (Address → Payment → Confirmation) |
| 🍞 Toasts | Non-intrusive animated notifications |
| 📱 Responsive | Mobile, tablet, and desktop — with mobile bottom nav bar |

## 🏷️ Promo Codes to Try

| Code | Benefit |
|---|---|
| `KART20` | 20% off entire order |
| `SAVE10` | 10% off any order |
| `FREESHIP` | Free shipping |
| `WELCOME50` | 50% off (min. $150 order) |

## 📁 File Structure

```
/
├── index.html          # Main HTML (semantic, accessible, SEO-ready)
├── css/
│   └── styles.css      # All styling — CSS custom properties, responsive, dark mode
└── js/
    ├── products.js     # Product catalog data (12 products, 5 categories)
    └── app.js          # All application logic and state management
```
