USE shopsphere_user;

DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS user_profiles;

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data for User Profiles
INSERT INTO user_profiles (id, auth_user_id, name, email, phone, avatar_url, bio) VALUES
(1, 1, 'Admin User', 'admin@shopsphere.com', '+1 (555) 019-2834', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ShopSphere System Administrator'),
(2, 2, 'Jane Doe', 'customer@shopsphere.com', '+1 (555) 438-9210', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Verified ShopSphere Customer & Tech Enthusiast');

-- Seed Data for Addresses
INSERT INTO addresses (id, user_id, full_name, phone, street, city, state, postal_code, country, is_default, address_type) VALUES
(1, 2, 'Jane Doe', '+1 (555) 438-9210', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', TRUE, 'HOME'),
(2, 2, 'Jane Doe (Office)', '+1 (555) 438-9210', '100 Silicon Ave, Suite 400', 'San Jose', 'CA', '95113', 'United States', FALSE, 'WORK');
