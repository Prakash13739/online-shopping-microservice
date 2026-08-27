USE shopsphere_product;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    sku VARCHAR(50) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    discount_price DECIMAL(12, 2),
    category_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 4.50,
    review_count INT DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8 Standard Categories
INSERT INTO categories (id, name, slug, description, image_url, status) VALUES
(1, 'Electronics', 'electronics', 'Cutting-edge smartphones, laptops, smart audio and tech gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', 'ACTIVE'),
(2, 'Fashion', 'fashion', 'Designer apparel, premium shoes, casual wear, and seasonal trends', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', 'ACTIVE'),
(3, 'Home & Kitchen', 'home-kitchen', 'Modern appliances, cookware, ergonomic furniture and decor', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500', 'ACTIVE'),
(4, 'Books', 'books', 'Bestselling fiction, non-fiction, academic, self-help, and sci-fi', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 'ACTIVE'),
(5, 'Sports & Fitness', 'sports-fitness', 'Workout equipment, activewear, outdoor gear and athletic accessories', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500', 'ACTIVE'),
(6, 'Beauty & Personal Care', 'beauty-personal-care', 'Skincare essentials, luxury fragrances, grooming, and cosmetics', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', 'ACTIVE'),
(7, 'Groceries & Gourmet', 'groceries-gourmet', 'Artisanal coffee, organic superfoods, premium teas and pantry essentials', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', 'ACTIVE'),
(8, 'Accessories', 'accessories', 'Luxury watches, minimalist wallets, sunglasses and leather goods', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'ACTIVE');

-- 36 Comprehensive, Realistic Products Across All 8 Categories
INSERT INTO products (id, name, slug, description, sku, brand, price, discount_price, category_id, image_url, rating, review_count, status) VALUES
-- Electronics (Cat 1)
(1, 'Aura Ultra Wireless ANC Headphones', 'aura-ultra-wireless-anc-headphones', 'Premium active noise-cancelling over-ear headphones with 40-hour battery life and spatial audio fidelity.', 'ELEC-AUR-001', 'AuraSound', 299.99, 249.99, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4.85, 342, 'ACTIVE'),
(2, 'ProBook Horizon 16-inch M3 Pro', 'probook-horizon-16-m3', 'Ultra-slim workstation laptop with 3.2K Liquid Retina display, 32GB unified RAM, and 1TB NVMe SSD.', 'ELEC-PBK-002', 'HorizonTech', 1899.00, 1749.00, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 4.92, 189, 'ACTIVE'),
(3, 'PixelPro 10 Ultra 5G (256GB)', 'pixelpro-10-ultra-5g', 'Next-generation flagship smartphone with computational AI 200MP camera system and LTPO OLED 120Hz display.', 'ELEC-PXL-003', 'NovaMobile', 999.00, 899.00, 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 4.78, 512, 'ACTIVE'),
(4, 'Chronos Elite Titanium Smartwatch', 'chronos-elite-titanium-smartwatch', 'Aerospace-grade titanium smartwatch featuring sapphire crystal, continuous ECG, dual GPS, and 14-day battery.', 'ELEC-CHR-004', 'Chronos', 349.50, 299.00, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 4.67, 245, 'ACTIVE'),
(5, 'SonicBoom Mini Bluetooth Speaker', 'sonicboom-mini-bluetooth-speaker', 'IPX7 waterproof rugged portable speaker delivering 360-degree high-definition sound with deep bass punch.', 'ELEC-SBM-005', 'SonicAudio', 79.99, 59.99, 1, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 4.55, 128, 'ACTIVE'),

-- Fashion (Cat 2)
(6, 'Tailored Italian Merino Wool Blazer', 'tailored-italian-merino-wool-blazer', 'Handcrafted slim-fit navy blazer spun from 100% fine Italian Merino wool with horn buttons.', 'FASH-BLZ-006', 'Vincenzo Milano', 320.00, 269.00, 2, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 4.80, 78, 'ACTIVE'),
(7, 'Urban Luxe Minimalist White Sneakers', 'urban-luxe-minimalist-white-sneakers', 'Full-grain calfskin leather low-top sneakers with cushioned OrthoLite insole and vulcanized rubber sole.', 'FASH-SNK-007', 'Strider Lab', 145.00, 120.00, 2, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500', 4.71, 310, 'ACTIVE'),
(8, 'Organic Pima Cotton Crewneck Tee (3-Pack)', 'organic-pima-cotton-crewneck-tee-3pk', 'Luxuriously soft, breathable heavyweight organic Pima cotton tees in black, heather grey, and crisp white.', 'FASH-TEE-008', 'EcoEssentials', 65.00, 49.99, 2, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 4.62, 415, 'ACTIVE'),
(9, 'Classic Heritage Trench Coat', 'classic-heritage-trench-coat', 'Double-breasted weatherproof cotton gabardine trench coat with vintage check lining and belted cuffs.', 'FASH-TRN-009', 'Savile Row Co.', 280.00, 235.00, 2, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500', 4.88, 92, 'ACTIVE'),
(10, 'Athletic Performance Tech Joggers', 'athletic-performance-tech-joggers', 'Four-way stretch moisture-wicking joggers with concealed zip pockets and ergonomic tapered fit.', 'FASH-JOG-010', 'AeroFlex', 85.00, 68.00, 2, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500', 4.58, 204, 'ACTIVE'),

-- Home & Kitchen (Cat 3)
(11, 'Barista Touch Precision Espresso Machine', 'barista-touch-precision-espresso-machine', 'Dual boiler commercial-grade espresso machine with digital PID thermal control and integrated burr grinder.', 'HOME-ESP-011', 'CremaTech', 799.00, 699.00, 3, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 4.90, 156, 'ACTIVE'),
(12, 'Cast Iron Enameled Dutch Oven (6 Qt)', 'cast-iron-enameled-dutch-oven-6qt', 'Heirloom quality enameled cast iron Dutch oven for superior heat retention, slow braising, and artisan sourdough.', 'HOME-DTC-012', 'Le Maison Cook', 180.00, 149.00, 3, 'https://images.unsplash.com/photo-1584990347449-397a61d1544a?w=500', 4.86, 280, 'ACTIVE'),
(13, 'AromaPure Smart HEPA Air Purifier', 'aromapure-smart-hepa-air-purifier', 'Medical-grade H13 true HEPA filter removes 99.97% of airborne allergens with smart app control and laser PM2.5 monitor.', 'HOME-APR-013', 'PureAir Labs', 199.99, 159.99, 3, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', 4.74, 198, 'ACTIVE'),
(14, 'Ergonomic Natural Bamboo Standing Desk', 'ergonomic-natural-bamboo-standing-desk', 'Motorized dual-motor height adjustable standing desk with solid bamboo top and anti-collision memory presets.', 'HOME-DSK-014', 'ErgoWorkspace', 450.00, 389.00, 3, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500', 4.82, 114, 'ACTIVE'),
(15, 'Nordic Minimalist Ceramic Dinnerware Set', 'nordic-minimalist-ceramic-dinnerware-set', '16-piece matte stoneware collection including dinner plates, salad bowls, side plates, and handcrafted mugs.', 'HOME-DIN-015', 'Kobenhavn Studio', 129.00, 99.00, 3, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500', 4.65, 87, 'ACTIVE'),

-- Books (Cat 4)
(16, 'Designing Data-Intensive Applications (Hardcover)', 'designing-data-intensive-applications', 'The definitive guide to distributed systems architecture, reliable storage, and modern streaming data pipelines.', 'BOOK-DDIA-016', 'O Reilly Media', 54.99, 44.99, 4, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 4.98, 890, 'ACTIVE'),
(17, 'Clean Code: A Handbook of Agile Craftsmanship', 'clean-code-handbook', 'Robert C. Martin legendary guide to writing readable, maintainable, and elegant software systems.', 'BOOK-CLNC-017', 'Prentice Hall', 49.99, 39.99, 4, 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=500', 4.89, 1240, 'ACTIVE'),
(18, 'Atomic Habits by James Clear', 'atomic-habits-james-clear', 'An easy and proven way to build good habits, break bad ones, and achieve remarkable long-term compound growth.', 'BOOK-ATHB-018', 'Avery Publishing', 27.00, 19.99, 4, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 4.95, 2300, 'ACTIVE'),
(19, 'System Design Interview – An Insider Guide Vol 1 & 2', 'system-design-interview-insiders-guide', 'Master large-scale system design concepts, microservices patterns, caching strategies, and distributed consensus.', 'BOOK-SYSD-019', 'ByteByteGo', 75.00, 59.99, 4, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500', 4.94, 620, 'ACTIVE'),

-- Sports & Fitness (Cat 5)
(20, 'PowerGrip Adjustable Dumbbell Set (5-52.5 lbs)', 'powergrip-adjustable-dumbbell-set', 'Space-saving rapid weight selection dial dumbbell pair replacing 15 separate sets of free weights.', 'SPRT-DMB-020', 'IronVault', 399.00, 329.00, 5, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500', 4.84, 310, 'ACTIVE'),
(21, 'ProForm High-Density Eco Yoga Mat (6mm)', 'proform-high-density-eco-yoga-mat', 'Non-slip textured surface made from sustainably harvested natural tree rubber with alignment guides.', 'SPRT-YOG-021', 'ZenAthletics', 68.00, 49.00, 5, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', 4.70, 185, 'ACTIVE'),
(22, 'HydroTrail Insulated Stainless Steel Bottle (32oz)', 'hydrotrail-insulated-stainless-bottle-32oz', 'Double-wall vacuum insulation keeps beverages iced for 24 hours or steaming hot for 12 hours.', 'SPRT-BTL-022', 'Summit Gear', 38.00, 29.99, 5, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 4.78, 540, 'ACTIVE'),
(23, 'SpeedMaster Smart Jump Rope with OLED Display', 'speedmaster-smart-jump-rope', 'Precision ball bearings, steel wire cable, and real-time Bluetooth rotation counter syncing to mobile app.', 'SPRT-JMP-023', 'AeroSpeed', 42.00, 34.00, 5, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500', 4.52, 98, 'ACTIVE'),

-- Beauty & Personal Care (Cat 6)
(24, 'Botanical Radiance Vitamin C Serum (30ml)', 'botanical-radiance-vitamin-c-serum', 'Potent 20% L-Ascorbic acid with Ferulic acid and hyaluronic acid for luminous skin tone brightening.', 'BEAU-SRM-024', 'Lumiere Botanical', 58.00, 46.00, 6, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 4.81, 410, 'ACTIVE'),
(25, 'Santale Royal Eau de Parfum (100ml)', 'santale-royal-eau-de-parfum', 'Exquisite artisanal fragrance blending creamy sandalwood, smoked amber, cardamom, and Damascus rose.', 'BEAU-PRF-025', 'Maison Noir', 165.00, 139.00, 6, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', 4.91, 142, 'ACTIVE'),
(26, 'Ionic Sonic Electric Toothbrush with Travel Case', 'ionic-sonic-electric-toothbrush', '40,000 VPM ultrasonic motor, wireless inductive charging dock, and 4 specialized brushing modes.', 'BEAU-TBS-026', 'DentPulse', 89.00, 69.00, 6, 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500', 4.68, 220, 'ACTIVE'),
(27, 'Nourishing Organic Argan Hair Oil (100ml)', 'nourishing-organic-argan-hair-oil', 'Cold-pressed virgin Moroccan argan oil enriched with vitamin E for silky frizz control and heat protection.', 'BEAU-ARG-027', 'Atlas Pure', 34.00, 26.50, 6, 'https://images.unsplash.com/photo-1608248597359-598d9e2617f6?w=500', 4.63, 175, 'ACTIVE'),

-- Groceries & Gourmet (Cat 7)
(28, 'Ethiopian Yirgacheffe Single-Origin Whole Beans (1kg)', 'ethiopian-yirgacheffe-coffee-beans-1kg', 'Lightly roasted specialty beans with delicate jasmine floral aroma, sweet bergamot, and blueberry notes.', 'GROC-COF-028', 'Altitude Roasters', 36.00, 29.50, 7, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 4.93, 388, 'ACTIVE'),
(29, 'Raw New Zealand Manuka Honey UMF 15+ (250g)', 'raw-manuka-honey-umf-15', 'Certified 100% pure authentic raw Manuka honey with potent natural antibacterial bio-activity (MGO 514+).', 'GROC-HNY-029', 'Kiwi Reserve', 62.00, 49.99, 7, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 4.87, 215, 'ACTIVE'),
(30, 'Cold-Pressed Extra Virgin Olive Oil PDO (750ml)', 'cold-pressed-extra-virgin-olive-oil-pdo', 'Single-estate early harvest Koroneiki olives with peppery finish and polyphenol antioxidant richness.', 'GROC-EVO-030', 'Aegean Gold', 28.00, 22.00, 7, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 4.79, 160, 'ACTIVE'),
(31, 'Imperial Ceremonial Grade Uji Matcha (50g)', 'imperial-ceremonial-grade-uji-matcha', 'First-harvest shade-grown stone-ground Japanese green tea powder with vibrant emerald hue and rich umami.', 'GROC-MTC-031', 'Kyoto Tradition', 44.00, 35.00, 7, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', 4.88, 290, 'ACTIVE'),

-- Accessories (Cat 8)
(32, 'Full-Grain Tuscan Leather Messenger Bag', 'full-grain-tuscan-leather-messenger-bag', 'Vegetable-tanned full grain leather briefcase with padded 15-inch laptop compartment and brass hardware.', 'ACCS-BAG-032', 'Artigiano Firenze', 260.00, 219.00, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 4.92, 118, 'ACTIVE'),
(33, 'Aviation Polarized Titanium Sunglasses', 'aviation-polarized-titanium-sunglasses', 'Ultra-lightweight titanium frames with anti-reflective polarized UV400 lenses and hydro-oleophobic coating.', 'ACCS-SNG-033', 'Solstice Optics', 175.00, 139.00, 8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 4.75, 230, 'ACTIVE'),
(34, 'Minimalist RFID-Blocking Slim Cardholder', 'minimalist-rfid-blocking-slim-cardholder', 'Machined aerospace aluminum wallet with quick-draw card ejection mechanism and expandable silicone cash strap.', 'ACCS-WLT-034', 'VaultCore', 48.00, 38.00, 8, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 4.67, 460, 'ACTIVE'),
(35, 'Automatic Skeleton Mechanical Watch', 'automatic-skeleton-mechanical-watch', 'Self-winding 24-jewel movement visible through sapphire exhibition caseback with genuine alligator strap.', 'ACCS-SKL-035', 'Chronos Atelier', 420.00, 350.00, 8, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', 4.86, 94, 'ACTIVE'),
(36, 'Silk Jacquard Geometric Woven Necktie', 'silk-jacquard-geometric-woven-necktie', 'Hand-stitched 100% mulberry silk tie with micro-geometric motif and wool interlining for perfect dimple knot.', 'ACCS-TIE-036', 'Savile Row Co.', 55.00, 42.00, 8, 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500', 4.70, 82, 'ACTIVE');
