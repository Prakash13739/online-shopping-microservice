USE shopsphere_order;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

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

-- Historical Orders for Real-Time Analytics & Order Tracking Demo
INSERT INTO orders (id, order_number, user_id, total_amount, shipping_amount, discount_amount, grand_total, status, payment_method, shipping_address, created_at) VALUES
(1, 'ORD-20260810-1011', 2, 1749.00, 0.00, 50.00, 1699.00, 'DELIVERED', 'CARD', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 'ORD-20260815-1022', 2, 339.97, 0.00, 0.00, 339.97, 'DELIVERED', 'UPI', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 'ORD-20260820-1033', 2, 699.00, 15.00, 20.00, 694.00, 'SHIPPED', 'CARD', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 'ORD-20260825-1044', 2, 159.99, 0.00, 10.00, 149.99, 'PROCESSING', 'NET_BANKING', 'Jane Doe (Office), 100 Silicon Ave, Suite 400, San Jose, CA 95113', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 'ORD-20260827-1055', 2, 899.00, 0.00, 0.00, 899.00, 'CONFIRMED', 'UPI', 'Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477', NOW());

INSERT INTO order_items (id, order_id, product_id, product_name, product_image, unit_price, quantity, subtotal) VALUES
(1, 1, 2, 'ProBook Horizon 16-inch M3 Pro', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1749.00, 1, 1749.00),
(2, 2, 1, 'Aura Ultra Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 249.99, 1, 249.99),
(3, 2, 16, 'Designing Data-Intensive Applications (Hardcover)', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 44.99, 2, 89.98),
(4, 3, 11, 'Barista Touch Precision Espresso Machine', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 699.00, 1, 699.00),
(5, 4, 13, 'AromaPure Smart HEPA Air Purifier', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', 159.99, 1, 159.99),
(6, 5, 3, 'PixelPro 10 Ultra 5G (256GB)', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 899.00, 1, 899.00);
