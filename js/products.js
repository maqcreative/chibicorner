// Mock Product Database for Online Kart (Kartify)
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Aura Sound Pro Wireless ANC Headphones',
    category: 'audio',
    categoryName: 'Audio & Wearables',
    price: 149.99,
    originalPrice: 229.99,
    rating: 4.8,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    badge: 'Bestseller',
    inStock: true,
    description: 'Immersive sound with industry-leading Active Noise Cancellation, 40-hour battery life, and ultra-plush memory foam earcups.',
    specs: {
      'Battery Life': '40 Hours',
      'Connectivity': 'Bluetooth 5.3 & AUX',
      'Noise Cancellation': 'Hybrid ANC (-38dB)',
      'Weight': '250g'
    }
  },
  {
    id: 'prod-2',
    name: 'Chronos Ultra Smartwatch Series 9',
    category: 'audio',
    categoryName: 'Audio & Wearables',
    price: 199.50,
    originalPrice: 299.00,
    rating: 4.7,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
    badge: 'Hot Deal',
    inStock: true,
    description: 'Always-On Retina display with blood oxygen tracking, ECG monitor, sapphire crystal glass, and 100+ fitness workout modes.',
    specs: {
      'Display': '1.9" AMOLED 1000 nits',
      'Battery': 'Up to 5 Days',
      'Water Resistance': '50m (5 ATM)',
      'Sensors': 'SpO2, Heart Rate, ECG'
    }
  },
  {
    id: 'prod-3',
    name: 'Titan Gaming Mechanical RGB Keyboard',
    category: 'computing',
    categoryName: 'Computing & Gaming',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.9,
    reviewsCount: 754,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
    badge: 'Trending',
    inStock: true,
    description: 'Custom hot-swappable linear switches, per-key dynamic RGB illumination, sound dampening silicone foam, and CNC aluminum frame.',
    specs: {
      'Switches': 'Custom Hot-swap Linear Red',
      'Layout': '75% Compact',
      'Connectivity': 'Tri-mode (2.4G / BT / USB-C)',
      'Keycaps': 'Double-shot PBT'
    }
  },
  {
    id: 'prod-4',
    name: 'Apex Precision Wireless Optical Mouse',
    category: 'computing',
    categoryName: 'Computing & Gaming',
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80',
    badge: 'Sale',
    inStock: true,
    description: 'Ergonomic lightweight honeycomb design with 26,000 DPI sensor, PTFE glide feet, and 90-hour ultra-low latency wireless play.',
    specs: {
      'DPI': '26,000 DPI Optical',
      'Weight': '58 grams',
      'Battery': '90 Hours',
      'Buttons': '6 Programmable'
    }
  },
  {
    id: 'prod-5',
    name: 'Zenith 15.6" OLED Creator Laptop',
    category: 'computing',
    categoryName: 'Computing & Gaming',
    price: 1199.00,
    originalPrice: 1499.00,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80',
    badge: 'Top Rated',
    inStock: true,
    description: 'Supercharged performance powered by 14-Core Gen processor, 32GB DDR5 RAM, 1TB NVMe Gen4 SSD, and Pantone Validated 4K OLED.',
    specs: {
      'Processor': 'Intel Core i7-13700H',
      'Memory & Storage': '32GB RAM / 1TB SSD',
      'Display': '15.6" 3.2K OLED 120Hz',
      'Graphics': 'RTX 4060 8GB GDDR6'
    }
  },
  {
    id: 'prod-6',
    name: 'Nova Pro 5G Smartphone (256GB)',
    category: 'mobiles',
    categoryName: 'Smartphones & Tablets',
    price: 699.00,
    originalPrice: 849.00,
    rating: 4.8,
    reviewsCount: 2150,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80',
    badge: 'Bestseller',
    inStock: true,
    description: 'Next-gen flagship with 108MP triple lens studio camera, 6.7" Fluid AMOLED 144Hz panel, and 100W HyperCharge (100% in 22 mins).',
    specs: {
      'Camera': '108MP OIS + 16MP UW + 12MP Tele',
      'Display': '6.7" Quad HD+ 144Hz',
      'Battery': '5000 mAh / 100W Fast Charge',
      'OS': 'Android 14 with Clean UI'
    }
  },
  {
    id: 'prod-7',
    name: 'Urban Canvas Minimalist Laptop Backpack',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviewsCount: 680,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    inStock: true,
    description: 'Water-resistant coated canvas backpack with padded 16" laptop sleeve, concealed anti-theft pocket, and USB charging pass-through.',
    specs: {
      'Capacity': '24 Liters',
      'Material': 'Water-resistant Oxford Nylon',
      'Compartments': '3 Main + 6 Organizers',
      'Weight': '720g'
    }
  },
  {
    id: 'prod-8',
    name: 'Classic Vintage Denim Jacket (Washed)',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 64.50,
    originalPrice: 95.00,
    rating: 4.5,
    reviewsCount: 430,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80',
    badge: 'Trending',
    inStock: true,
    description: '100% heavyweight cotton denim crafted with vintage stonewashing, custom copper button closures, and timeless tailored silhouette.',
    specs: {
      'Fabric': '100% Cotton (13.5 oz denim)',
      'Fit': 'Regular / Comfort Fit',
      'Care': 'Machine wash cold',
      'Sizes': 'S, M, L, XL, XXL'
    }
  },
  {
    id: 'prod-9',
    name: 'Retro Polarized Aviator Sunglasses',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 24.99,
    originalPrice: 45.00,
    rating: 4.7,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80',
    badge: 'Hot Deal',
    inStock: true,
    description: 'UV400 polarized HD lenses with ultralight stainless steel wireframes and soft anti-slip silicone nose pads for all-day comfort.',
    specs: {
      'UV Protection': 'UV400 / 100% UVA & UVB',
      'Frame Material': 'Stainless Steel Alloy',
      'Lens': 'Triacetate TAC Polarized',
      'Includes': 'Hard Case & Microfiber Cloth'
    }
  },
  {
    id: 'prod-10',
    name: 'AromaPulse Smart Ultrasonic Humidifier & Diffuser',
    category: 'home',
    categoryName: 'Home & Living',
    price: 45.00,
    originalPrice: 75.00,
    rating: 4.8,
    reviewsCount: 610,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    inStock: true,
    description: 'Whisper-quiet ultrasonic mist generator with ambient mood lighting, essential oil tray, auto shut-off, and smart app control.',
    specs: {
      'Tank Capacity': '3.5 Liters (up to 30 hrs)',
      'Coverage Area': 'Up to 400 sq. ft.',
      'Noise Level': '< 24 dB (Whisper Quiet)',
      'Timer': '2h / 4h / 8h / Continuous'
    }
  },
  {
    id: 'prod-11',
    name: 'Barista Touch Compact Espresso Machine',
    category: 'home',
    categoryName: 'Home & Living',
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=700&q=80',
    badge: 'Bestseller',
    inStock: true,
    description: '20-bar Italian high pressure pump with thermoblock rapid heating, micro-foam steam wand, and single/double shot pre-sets.',
    specs: {
      'Pressure': '20 Bar Italian Pump',
      'Heating': 'ThermoBlock (Preheats in 25s)',
      'Water Tank': '1.8L Removable',
      'Finish': 'Brushed Stainless Steel'
    }
  },
  {
    id: 'prod-12',
    name: 'Lumina Minimalist Magnetic Desk Lamp',
    category: 'home',
    categoryName: 'Home & Living',
    price: 34.99,
    originalPrice: 55.00,
    rating: 4.6,
    reviewsCount: 390,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
    badge: 'New',
    inStock: true,
    description: 'Eye-caring zero blue-light flicker desk lamp with magnetic ball switch, stepless brightness touch slider, and USB-C rechargeable battery.',
    specs: {
      'Color Temp': '3000K - 6000K (3 Modes)',
      'Battery': '2400mAh (Up to 16h runtime)',
      'Control': 'Stepless Touch Dimming',
      'Material': 'Matte Anodized Aluminum'
    }
  }
];

// Available promotional coupons
const PROMO_COUPONS = {
  'KART20': { discount: 0.20, label: '20% OFF Site-wide' },
  'SAVE10': { discount: 0.10, label: '10% OFF Any Order' },
  'FREESHIP': { discount: 0, freeShipping: true, label: 'Free Express Shipping' },
  'WELCOME50': { discount: 0.50, minSpend: 150, label: '50% OFF (Min $150)' }
};
