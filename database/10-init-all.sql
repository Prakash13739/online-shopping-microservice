-- Master Database Initialization Script for ShopSphere
-- Run this in MySQL CLI or MySQL Workbench:
-- mysql -u root -pprakash121a@ < database/10-init-all.sql

SOURCE 01-create-databases.sql;
SOURCE 02-auth-schema-and-data.sql;
SOURCE 03-user-schema-and-data.sql;
SOURCE 04-product-schema-and-data.sql;
SOURCE 05-inventory-schema-and-data.sql;
SOURCE 06-cart-schema.sql;
SOURCE 07-order-schema-and-data.sql;
SOURCE 08-payment-schema-and-data.sql;
SOURCE 09-notification-schema-and-data.sql;
