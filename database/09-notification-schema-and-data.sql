USE shopsphere_notification;

DROP TABLE IF EXISTS notifications;

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

-- Realistic Notifications for Demo Customer (User ID: 2)
INSERT INTO notifications (id, user_id, order_id, type, title, message, is_read, created_at) VALUES
(1, 2, 1, 'ORDER_DELIVERED', 'Order Delivered!', 'Your order #ORD-20260810-1011 has been safely delivered to your address.', TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(2, 2, 3, 'ORDER_SHIPPED', 'Order Shipped via Express Air', 'Your order #ORD-20260820-1033 is in transit with carrier tracking number EXP-992140.', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 2, 5, 'ORDER_CONFIRMED', 'Order Placed & Confirmed!', 'Thank you! We have received your order #ORD-20260827-1055 for $899.00.', FALSE, NOW());
