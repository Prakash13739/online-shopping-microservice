-- ShopSphere Consolidated Database Schema & Seed Data
CREATE DATABASE IF NOT EXISTS shopsphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopsphere_db;

-- 1. AUTH & ROLES
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'System Administrator with full access'),
(2, 'ROLE_CUSTOMER', 'Standard customer account');

-- Password for both users is 'admin123' and 'customer123' (BCrypt hash)
INSERT INTO users (id, name, email, password_hash, role_id, phone, status) VALUES
(1, 'Admin User', 'admin@shopsphere.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWChYq', 1, '+1 (555) 019-2834', 'ACTIVE'),
(2, 'Jane Doe', 'customer@shopsphere.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWChYq', 2, '+1 (555) 438-9210', 'ACTIVE');

-- 2. USER PROFILES & ADDRESSES
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    bio VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    address_type VARCHAR(20) NOT NULL DEFAULT 'HOME',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO user_profiles (id, auth_user_id, name, email, phone, avatar_url, bio) VALUES
(1, 1, 'Admin User', 'admin@shopsphere.com', '+1 (555) 019-2834', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ShopSphere System Administrator'),
(2, 2, 'Jane Doe', 'customer@shopsphere.com', '+1 (555) 438-9210', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Verified Customer');

INSERT INTO addresses (id, user_id, full_name, phone, street, city, state, postal_code, country, is_default, address_type) VALUES
(1, 2, 'Jane Doe', '+1 (555) 438-9210', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', TRUE, 'HOME');

-- 3. CATEGORIES & PRODUCTS
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

INSERT INTO categories (id, name, slug, description, image_url, status) VALUES
(1, 'Electronics', 'electronics', 'Smartphones, laptops, smart audio and tech gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', 'ACTIVE'),
(2, 'Fashion', 'fashion', 'Designer apparel, shoes, and seasonal trends', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', 'ACTIVE'),
(3, 'Home & Kitchen', 'home-kitchen', 'Appliances, cookware, and modern decor', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500', 'ACTIVE'),
(4, 'Books', 'books', 'Bestselling non-fiction, fiction, and tech', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 'ACTIVE'),
(5, 'Sports & Fitness', 'sports-fitness', 'Workout equipment, activewear, and athletic gear', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500', 'ACTIVE'),
(6, 'Beauty & Personal Care', 'beauty-personal-care', 'Skincare essentials, grooming, and luxury perfumes', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', 'ACTIVE'),
(7, 'Groceries & Gourmet', 'groceries-gourmet', 'Specialty coffee, organic honey, and pantry staples', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', 'ACTIVE'),
(8, 'Accessories', 'accessories', 'Watches, minimalist wallets, and sunglasses', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'ACTIVE');

INSERT INTO products (id, name, slug, description, sku, brand, price, discount_price, category_id, image_url, rating, review_count, status) VALUES
(1, 'Aura Ultra Wireless ANC Headphones', 'aura-ultra-wireless-anc-headphones', 'Premium active noise-cancelling over-ear headphones with 40-hour battery life and spatial audio fidelity.', 'ELEC-AUR-001', 'AuraSound', 299.99, 249.99, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4.85, 342, 'ACTIVE'),
(2, 'ProBook Horizon 16-inch M3 Pro', 'probook-horizon-16-m3', 'Ultra-slim workstation laptop with 3.2K Liquid Retina display, 32GB unified RAM, and 1TB NVMe SSD.', 'ELEC-PBK-002', 'HorizonTech', 1899.00, 1749.00, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 4.92, 189, 'ACTIVE'),
(3, 'PixelPro 10 Ultra 5G (256GB)', 'pixelpro-10-ultra-5g', 'Next-generation flagship smartphone with computational AI 200MP camera system and LTPO OLED display.', 'ELEC-PXL-003', 'NovaMobile', 999.00, 899.00, 1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 4.78, 512, 'ACTIVE'),
(4, 'Chronos Elite Titanium Smartwatch', 'chronos-elite-titanium-smartwatch', 'Aerospace-grade titanium smartwatch featuring sapphire crystal, continuous ECG, and 14-day battery.', 'ELEC-CHR-004', 'Chronos', 349.50, 299.00, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 4.67, 245, 'ACTIVE'),
(5, 'SonicBoom Mini Bluetooth Speaker', 'sonicboom-mini-bluetooth-speaker', 'IPX7 waterproof rugged portable speaker delivering 360-degree high-definition sound with deep bass.', 'ELEC-SBM-005', 'SonicAudio', 79.99, 59.99, 1, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 4.55, 128, 'ACTIVE'),
(6, 'Tailored Italian Merino Wool Blazer', 'tailored-italian-merino-wool-blazer', 'Handcrafted slim-fit navy blazer spun from 100% fine Italian Merino wool with horn buttons.', 'FASH-BLZ-006', 'Vincenzo Milano', 320.00, 269.00, 2, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 4.80, 78, 'ACTIVE'),
(7, 'Urban Luxe Minimalist White Sneakers', 'urban-luxe-minimalist-white-sneakers', 'Full-grain calfskin leather low-top sneakers with cushioned OrthoLite insole and vulcanized rubber sole.', 'FASH-SNK-007', 'Strider Lab', 145.00, 120.00, 2, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500', 4.71, 310, 'ACTIVE'),
(8, 'Organic Pima Cotton Crewneck Tee (3-Pack)', 'organic-pima-cotton-crewneck-tee-3pk', 'Luxuriously soft, breathable heavyweight organic Pima cotton tees in black, heather grey, and white.', 'FASH-TEE-008', 'EcoEssentials', 65.00, 49.99, 2, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 4.62, 415, 'ACTIVE'),
(9, 'Classic Heritage Trench Coat', 'classic-heritage-trench-coat', 'Double-breasted weatherproof cotton gabardine trench coat with vintage check lining and belted cuffs.', 'FASH-TRN-009', 'Savile Row Co.', 280.00, 235.00, 2, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500', 4.88, 92, 'ACTIVE'),
(10, 'Athletic Performance Tech Joggers', 'athletic-performance-tech-joggers', 'Four-way stretch moisture-wicking joggers with concealed zip pockets and ergonomic tapered fit.', 'FASH-JOG-010', 'AeroFlex', 85.00, 68.00, 2, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500', 4.58, 204, 'ACTIVE'),
(11, 'Barista Touch Precision Espresso Machine', 'barista-touch-precision-espresso-machine', 'Dual boiler commercial-grade espresso machine with digital PID thermal control and integrated grinder.', 'HOME-ESP-011', 'CremaTech', 799.00, 699.00, 3, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 4.90, 156, 'ACTIVE'),
(12, 'Cast Iron Enameled Dutch Oven (6 Qt)', 'cast-iron-enameled-dutch-oven-6qt', 'Heirloom quality enameled cast iron Dutch oven for superior heat retention and slow braising.', 'HOME-DTC-012', 'Le Maison Cook', 180.00, 149.00, 3, 'https://images.unsplash.com/photo-1584990347449-397a61d1544a?w=500', 4.86, 280, 'ACTIVE'),
(13, 'AromaPure Smart HEPA Air Purifier', 'aromapure-smart-hepa-air-purifier', 'Medical-grade H13 true HEPA filter removes 99.97% of airborne allergens with smart app control.', 'HOME-APR-013', 'PureAir Labs', 199.99, 159.99, 3, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', 4.74, 198, 'ACTIVE'),
(14, 'Ergonomic Natural Bamboo Standing Desk', 'ergonomic-natural-bamboo-standing-desk', 'Motorized dual-motor height adjustable standing desk with solid bamboo top and memory presets.', 'HOME-DSK-014', 'ErgoWorkspace', 450.00, 389.00, 3, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500', 4.82, 114, 'ACTIVE'),
(15, 'Nordic Minimalist Ceramic Dinnerware Set', 'nordic-minimalist-ceramic-dinnerware-set', '16-piece matte stoneware collection including dinner plates, salad bowls, and handcrafted mugs.', 'HOME-DIN-015', 'Kobenhavn Studio', 129.00, 99.00, 3, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500', 4.65, 87, 'ACTIVE'),
(16, 'Designing Data-Intensive Applications', 'designing-data-intensive-applications', 'The definitive guide to distributed systems architecture, reliable storage, and streaming data.', 'BOOK-DDIA-016', 'O Reilly Media', 54.99, 44.99, 4, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 4.98, 890, 'ACTIVE'),
(17, 'Clean Code: A Handbook of Agile Craftsmanship', 'clean-code-handbook', 'Robert C. Martin legendary guide to writing readable, maintainable, and elegant software systems.', 'BOOK-CLNC-017', 'Prentice Hall', 49.99, 39.99, 4, 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=500', 4.89, 1240, 'ACTIVE'),
(18, 'Atomic Habits by James Clear', 'atomic-habits-james-clear', 'An easy and proven way to build good habits, break bad ones, and achieve remarkable compound growth.', 'BOOK-ATHB-018', 'Avery Publishing', 27.00, 19.99, 4, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 4.95, 2300, 'ACTIVE'),
(19, 'System Design Interview – Volume 1 & 2', 'system-design-interview-insiders-guide', 'Master large-scale system design concepts, microservices patterns, and caching strategies.', 'BOOK-SYSD-019', 'ByteByteGo', 75.00, 59.99, 4, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500', 4.94, 620, 'ACTIVE'),
(20, 'PowerGrip Adjustable Dumbbell Set (5-52.5 lbs)', 'powergrip-adjustable-dumbbell-set', 'Space-saving rapid weight selection dial dumbbell pair replacing 15 separate sets of free weights.', 'SPRT-DMB-020', 'IronVault', 399.00, 329.00, 5, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500', 4.84, 310, 'ACTIVE'),
(21, 'ProForm High-Density Eco Yoga Mat (6mm)', 'proform-high-density-eco-yoga-mat', 'Non-slip textured surface made from sustainably harvested natural tree rubber with alignment guides.', 'SPRT-YOG-021', 'ZenAthletics', 68.00, 49.00, 5, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', 4.70, 185, 'ACTIVE'),
(22, 'HydroTrail Insulated Stainless Steel Bottle (32oz)', 'hydrotrail-insulated-stainless-bottle-32oz', 'Double-wall vacuum insulation keeps beverages iced for 24 hours or steaming hot for 12 hours.', 'SPRT-BTL-022', 'Summit Gear', 38.00, 29.99, 5, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 4.78, 540, 'ACTIVE'),
(23, 'SpeedMaster Smart Jump Rope with OLED Display', 'speedmaster-smart-jump-rope', 'Precision ball bearings, steel wire cable, and real-time Bluetooth rotation counter syncing to mobile app.', 'SPRT-JMP-023', 'AeroSpeed', 42.00, 34.00, 5, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500', 4.52, 98, 'ACTIVE'),
(24, 'Botanical Radiance Vitamin C Serum (30ml)', 'botanical-radiance-vitamin-c-serum', 'Potent 20% L-Ascorbic acid with Ferulic acid and hyaluronic acid for luminous skin tone brightening.', 'BEAU-SRM-024', 'Lumiere Botanical', 58.00, 46.00, 6, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 4.81, 410, 'ACTIVE'),
(25, 'Santale Royal Eau de Parfum (100ml)', 'santale-royal-eau-de-parfum', 'Exquisite artisanal fragrance blending creamy sandalwood, smoked amber, and Damascus rose.', 'BEAU-PRF-025', 'Maison Noir', 165.00, 139.00, 6, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', 4.91, 142, 'ACTIVE'),
(26, 'Ionic Sonic Electric Toothbrush with Travel Case', 'ionic-sonic-electric-toothbrush', '40,000 VPM ultrasonic motor, wireless inductive charging dock, and 4 brushing modes.', 'BEAU-TBS-026', 'DentPulse', 89.00, 69.00, 6, 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500', 4.68, 220, 'ACTIVE'),
(27, 'Nourishing Organic Argan Hair Oil (100ml)', 'nourishing-organic-argan-hair-oil', 'Cold-pressed virgin Moroccan argan oil enriched with vitamin E for silky frizz control.', 'BEAU-ARG-027', 'Atlas Pure', 34.00, 26.50, 6, 'https://images.unsplash.com/photo-1608248597359-598d9e2617f6?w=500', 4.63, 175, 'ACTIVE'),
(28, 'Ethiopian Yirgacheffe Single-Origin Beans (1kg)', 'ethiopian-yirgacheffe-coffee-beans-1kg', 'Lightly roasted specialty beans with delicate jasmine floral aroma and sweet blueberry notes.', 'GROC-COF-028', 'Altitude Roasters', 36.00, 29.50, 7, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 4.93, 388, 'ACTIVE'),
(29, 'Raw New Zealand Manuka Honey UMF 15+ (250g)', 'raw-manuka-honey-umf-15', 'Certified 100% pure authentic raw Manuka honey with potent natural antibacterial bio-activity.', 'GROC-HNY-029', 'Kiwi Reserve', 62.00, 49.99, 7, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 4.87, 215, 'ACTIVE'),
(30, 'Cold-Pressed Extra Virgin Olive Oil PDO (750ml)', 'cold-pressed-extra-virgin-olive-oil-pdo', 'Single-estate early harvest Koroneiki olives with peppery finish and polyphenol richness.', 'GROC-EVO-030', 'Aegean Gold', 28.00, 22.00, 7, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 4.79, 160, 'ACTIVE'),
(31, 'Imperial Ceremonial Grade Uji Matcha (50g)', 'imperial-ceremonial-grade-uji-matcha', 'First-harvest shade-grown stone-ground Japanese green tea powder with vibrant emerald hue.', 'GROC-MTC-031', 'Kyoto Tradition', 44.00, 35.00, 7, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', 4.88, 290, 'ACTIVE'),
(32, 'Full-Grain Tuscan Leather Messenger Bag', 'full-grain-tuscan-leather-messenger-bag', 'Vegetable-tanned full grain leather briefcase with padded 15-inch laptop compartment.', 'ACCS-BAG-032', 'Artigiano Firenze', 260.00, 219.00, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 4.92, 118, 'ACTIVE'),
(33, 'Aviation Polarized Titanium Sunglasses', 'aviation-polarized-titanium-sunglasses', 'Ultra-lightweight titanium frames with anti-reflective polarized UV400 lenses.', 'ACCS-SNG-033', 'Solstice Optics', 175.00, 139.00, 8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 4.75, 230, 'ACTIVE'),
(34, 'Minimalist RFID-Blocking Slim Cardholder', 'minimalist-rfid-blocking-slim-cardholder', 'Machined aerospace aluminum wallet with quick-draw card ejection mechanism.', 'ACCS-WLT-034', 'VaultCore', 48.00, 38.00, 8, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 4.67, 460, 'ACTIVE'),
(35, 'Automatic Skeleton Mechanical Watch', 'automatic-skeleton-mechanical-watch', 'Self-winding 24-jewel movement visible through sapphire exhibition caseback.', 'ACCS-SKL-035', 'Chronos Atelier', 420.00, 350.00, 8, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500', 4.86, 94, 'ACTIVE'),
(36, 'Silk Jacquard Geometric Woven Necktie', 'silk-jacquard-geometric-woven-necktie', 'Hand-stitched 100% mulberry silk tie with micro-geometric motif and wool interlining.', 'ACCS-TIE-036', 'Savile Row Co.', 55.00, 42.00, 8, 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500', 4.70, 82, 'ACTIVE');

-- 4. INVENTORY
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    sku VARCHAR(50) NOT NULL UNIQUE,
    quantity_available INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_STOCK',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO inventory (id, product_id, sku, quantity_available, quantity_reserved, reorder_level, status) VALUES
(1, 1, 'ELEC-AUR-001', 45, 0, 10, 'IN_STOCK'),
(2, 2, 'ELEC-PBK-002', 18, 0, 5, 'IN_STOCK'),
(3, 3, 'ELEC-PXL-003', 32, 0, 10, 'IN_STOCK'),
(4, 4, 'ELEC-CHR-004', 25, 0, 8, 'IN_STOCK'),
(5, 5, 'ELEC-SBM-005', 60, 0, 15, 'IN_STOCK'),
(6, 6, 'FASH-BLZ-006', 14, 0, 5, 'IN_STOCK'),
(7, 7, 'FASH-SNK-007', 50, 0, 12, 'IN_STOCK'),
(8, 8, 'FASH-TEE-008', 85, 0, 20, 'IN_STOCK'),
(9, 9, 'FASH-TRN-009', 12, 0, 5, 'IN_STOCK'),
(10, 10, 'FASH-JOG-010', 40, 0, 10, 'IN_STOCK'),
(11, 11, 'HOME-ESP-011', 8, 0, 5, 'LOW_STOCK'),
(12, 12, 'HOME-DTC-012', 22, 0, 8, 'IN_STOCK'),
(13, 13, 'HOME-APR-013', 30, 0, 10, 'IN_STOCK'),
(14, 14, 'HOME-DSK-014', 6, 0, 5, 'LOW_STOCK'),
(15, 15, 'HOME-DIN-015', 28, 0, 10, 'IN_STOCK'),
(16, 16, 'BOOK-DDIA-016', 75, 0, 15, 'IN_STOCK'),
(17, 17, 'BOOK-CLNC-017', 90, 0, 20, 'IN_STOCK'),
(18, 18, 'BOOK-ATHB-018', 120, 0, 25, 'IN_STOCK'),
(19, 19, 'BOOK-SYSD-019', 65, 0, 15, 'IN_STOCK'),
(20, 20, 'SPRT-DMB-020', 15, 0, 5, 'IN_STOCK'),
(21, 21, 'SPRT-YOG-021', 42, 0, 10, 'IN_STOCK'),
(22, 22, 'SPRT-BTL-022', 95, 0, 20, 'IN_STOCK'),
(23, 23, 'SPRT-JMP-023', 38, 0, 10, 'IN_STOCK'),
(24, 24, 'BEAU-SRM-024', 55, 0, 15, 'IN_STOCK'),
(25, 25, 'BEAU-PRF-025', 4, 0, 5, 'LOW_STOCK'),
(26, 26, 'BEAU-TBS-026', 33, 0, 10, 'IN_STOCK'),
(27, 27, 'BEAU-ARG-027', 48, 0, 12, 'IN_STOCK'),
(28, 28, 'GROC-COF-028', 70, 0, 15, 'IN_STOCK'),
(29, 29, 'GROC-HNY-029', 24, 0, 8, 'IN_STOCK'),
(30, 30, 'GROC-EVO-030', 52, 0, 15, 'IN_STOCK'),
(31, 31, 'GROC-MTC-031', 3, 0, 5, 'LOW_STOCK'),
(32, 32, 'ACCS-BAG-032', 16, 0, 5, 'IN_STOCK'),
(33, 33, 'ACCS-SNG-033', 35, 0, 10, 'IN_STOCK'),
(34, 34, 'ACCS-WLT-034', 80, 0, 20, 'IN_STOCK'),
(35, 35, 'ACCS-SKL-035', 9, 0, 5, 'LOW_STOCK'),
(36, 36, 'ACCS-TIE-036', 44, 0, 10, 'IN_STOCK');

-- 5. CARTS
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(500),
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO carts (id, user_id) VALUES (1, 2);
INSERT INTO cart_items (id, cart_id, product_id, product_name, product_image, unit_price, quantity, subtotal) VALUES
(1, 1, 1, 'Aura Ultra Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 249.99, 1, 249.99),
(2, 1, 16, 'Designing Data-Intensive Applications', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 44.99, 2, 89.98);

-- 6. ORDERS & ORDER ITEMS
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    payment_method VARCHAR(30) NOT NULL DEFAULT 'CARD',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(500),
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO orders (id, order_number, user_id, total_amount, shipping_amount, discount_amount, grand_total, status, payment_method, shipping_address, created_at) VALUES
(1, 'ORD-20260810-1011', 2, 1749.00, 0.00, 50.00, 1699.00, 'DELIVERED', 'CARD', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 'ORD-20260815-1022', 2, 339.97, 0.00, 0.00, 339.97, 'DELIVERED', 'UPI', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 'ORD-20260820-1033', 2, 699.00, 15.00, 20.00, 694.00, 'SHIPPED', 'CARD', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 'ORD-20260825-1044', 2, 159.99, 0.00, 10.00, 149.99, 'PROCESSING', 'NET_BANKING', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 'ORD-20260827-1055', 2, 899.00, 0.00, 0.00, 899.00, 'CONFIRMED', 'UPI', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', NOW());

INSERT INTO order_items (id, order_id, product_id, product_name, product_image, unit_price, quantity, subtotal) VALUES
(1, 1, 2, 'ProBook Horizon 16-inch M3 Pro', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1749.00, 1, 1749.00),
(2, 2, 1, 'Aura Ultra Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 249.99, 1, 249.99),
(3, 2, 16, 'Designing Data-Intensive Applications', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 44.99, 2, 89.98),
(4, 3, 11, 'Barista Touch Precision Espresso Machine', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 699.00, 1, 699.00),
(5, 4, 13, 'AromaPure Smart HEPA Air Purifier', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', 159.99, 1, 159.99),
(6, 5, 3, 'PixelPro 10 Ultra 5G (256GB)', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 899.00, 1, 899.00);

-- 7. PAYMENTS
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_id VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    error_message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO payments (id, order_id, user_id, amount, payment_method, transaction_id, status, created_at) VALUES
(1, 1, 2, 1699.00, 'CARD', 'TXN-902148192834-VISA', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 2, 2, 339.97, 'UPI', 'TXN-719284719203-UPI', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 3, 2, 694.00, 'CARD', 'TXN-551029384756-MC', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 4, 2, 149.99, 'NET_BANKING', 'TXN-109283746582-HDFC', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 5, 2, 899.00, 'UPI', 'TXN-882910394857-UPI', 'SUCCESS', NOW());

-- 8. NOTIFICATIONS
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    type VARCHAR(40) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO notifications (id, user_id, order_id, type, title, message, is_read, created_at) VALUES
(1, 2, 1, 'ORDER_DELIVERED', 'Order Delivered!', 'Your order #ORD-20260810-1011 has been safely delivered to your address.', TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(2, 2, 3, 'ORDER_SHIPPED', 'Order Shipped via Express Air', 'Your order #ORD-20260820-1033 is in transit with carrier tracking number EXP-992140.', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 2, 5, 'ORDER_CONFIRMED', 'Order Placed & Confirmed!', 'Thank you! We have received your order #ORD-20260827-1055 for $899.00.', FALSE, NOW());
