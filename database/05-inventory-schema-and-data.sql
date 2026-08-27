USE shopsphere_inventory;

DROP TABLE IF EXISTS inventory;

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

-- Stock initialization for all 36 products
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
