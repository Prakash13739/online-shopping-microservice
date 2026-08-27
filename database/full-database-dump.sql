-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: shopsphere_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `shopsphere_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `shopsphere_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `shopsphere_db`;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'United States',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `address_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HOME',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,2,'Jane Doe','+1 (555) 438-9210','742 Evergreen Terrace','Springfield','OR','97477','United States',1,'HOME','2026-08-27 15:22:10','2026-08-27 15:22:10');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6oue0maw421roerltnxn16a38` (`cart_id`,`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,2,'2026-08-27 15:22:10','2026-08-27 15:22:10'),(2,1,'2026-08-27 10:06:09','2026-08-27 10:06:09');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','electronics','Smartphones, laptops, smart audio and tech gadgets','https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(2,'Fashion','fashion','Designer apparel, shoes, and seasonal trends','https://images.unsplash.com/photo-1445205170230-053b83016050?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(3,'Home & Kitchen','home-kitchen','Appliances, cookware, and modern decor','https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(4,'Books','books','Bestselling non-fiction, fiction, and tech','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(5,'Sports & Fitness','sports-fitness','Workout equipment, activewear, and athletic gear','https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(6,'Beauty & Personal Care','beauty-personal-care','Skincare essentials, grooming, and luxury perfumes','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(7,'Groceries & Gourmet','groceries-gourmet','Specialty coffee, organic honey, and pantry staples','https://images.unsplash.com/photo-1542838132-92c53300491e?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(8,'Accessories','accessories','Watches, minimalist wallets, and sunglasses','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_available` int NOT NULL DEFAULT '0',
  `quantity_reserved` int NOT NULL DEFAULT '0',
  `reorder_level` int NOT NULL DEFAULT '10',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_STOCK',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,'ELEC-AUR-001',44,0,10,'IN_STOCK','2026-08-27 10:05:44'),(2,2,'ELEC-PBK-002',15,0,5,'IN_STOCK','2026-08-27 10:10:36'),(3,3,'ELEC-PXL-003',32,0,10,'IN_STOCK','2026-08-27 15:22:10'),(4,4,'ELEC-CHR-004',25,0,8,'IN_STOCK','2026-08-27 15:22:10'),(5,5,'ELEC-SBM-005',60,0,15,'IN_STOCK','2026-08-27 15:22:10'),(6,6,'FASH-BLZ-006',14,0,5,'IN_STOCK','2026-08-27 15:22:10'),(7,7,'FASH-SNK-007',50,0,12,'IN_STOCK','2026-08-27 15:22:10'),(8,8,'FASH-TEE-008',85,0,20,'IN_STOCK','2026-08-27 15:22:10'),(9,9,'FASH-TRN-009',12,0,5,'IN_STOCK','2026-08-27 15:22:10'),(10,10,'FASH-JOG-010',40,0,10,'IN_STOCK','2026-08-27 15:22:10'),(11,11,'HOME-ESP-011',8,0,5,'LOW_STOCK','2026-08-27 15:22:10'),(12,12,'HOME-DTC-012',22,0,8,'IN_STOCK','2026-08-27 15:22:10'),(13,13,'HOME-APR-013',30,0,10,'IN_STOCK','2026-08-27 15:22:10'),(14,14,'HOME-DSK-014',6,0,5,'LOW_STOCK','2026-08-27 15:22:10'),(15,15,'HOME-DIN-015',28,0,10,'IN_STOCK','2026-08-27 15:22:10'),(16,16,'BOOK-DDIA-016',73,0,15,'IN_STOCK','2026-08-27 10:05:44'),(17,17,'BOOK-CLNC-017',90,0,20,'IN_STOCK','2026-08-27 15:22:10'),(18,18,'BOOK-ATHB-018',120,0,25,'IN_STOCK','2026-08-27 15:22:10'),(19,19,'BOOK-SYSD-019',65,0,15,'IN_STOCK','2026-08-27 15:22:10'),(20,20,'SPRT-DMB-020',15,0,5,'IN_STOCK','2026-08-27 15:22:10'),(21,21,'SPRT-YOG-021',42,0,10,'IN_STOCK','2026-08-27 15:22:10'),(22,22,'SPRT-BTL-022',95,0,20,'IN_STOCK','2026-08-27 15:22:10'),(23,23,'SPRT-JMP-023',38,0,10,'IN_STOCK','2026-08-27 15:22:10'),(24,24,'BEAU-SRM-024',55,0,15,'IN_STOCK','2026-08-27 15:22:10'),(25,25,'BEAU-PRF-025',4,0,5,'LOW_STOCK','2026-08-27 15:22:10'),(26,26,'BEAU-TBS-026',33,0,10,'IN_STOCK','2026-08-27 15:22:10'),(27,27,'BEAU-ARG-027',48,0,12,'IN_STOCK','2026-08-27 15:22:10'),(28,28,'GROC-COF-028',70,0,15,'IN_STOCK','2026-08-27 15:22:10'),(29,29,'GROC-HNY-029',24,0,8,'IN_STOCK','2026-08-27 15:22:10'),(30,30,'GROC-EVO-030',52,0,15,'IN_STOCK','2026-08-27 15:22:10'),(31,31,'GROC-MTC-031',3,0,5,'LOW_STOCK','2026-08-27 15:22:10'),(32,32,'ACCS-BAG-032',16,0,5,'IN_STOCK','2026-08-27 15:22:10'),(33,33,'ACCS-SNG-033',35,0,10,'IN_STOCK','2026-08-27 15:22:10'),(34,34,'ACCS-WLT-034',80,0,20,'IN_STOCK','2026-08-27 15:22:10'),(35,35,'ACCS-SKL-035',9,0,5,'LOW_STOCK','2026-08-27 15:22:10'),(36,36,'ACCS-TIE-036',44,0,10,'IN_STOCK','2026-08-27 15:22:10');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,1,'ORDER_DELIVERED','Order Delivered!','Your order #ORD-20260810-1011 has been safely delivered to your address.',1,'2026-08-15 15:22:10'),(2,2,3,'ORDER_SHIPPED','Order Shipped via Express Air','Your order #ORD-20260820-1033 is in transit with carrier tracking number EXP-992140.',0,'2026-08-25 15:22:10'),(3,2,5,'ORDER_CONFIRMED','Order Placed & Confirmed!','Thank you! We have received your order #ORD-20260827-1055 for $899.00.',1,'2026-08-27 15:22:10'),(4,2,6,'PAYMENT_FAILED','Payment Failed for Order #ORD-1787844933163','Payment could not be processed. Any reserved items have been restored to stock.',0,'2026-08-27 10:05:33'),(5,2,7,'PAYMENT_FAILED','Payment Failed for Order #ORD-1787844935717','Payment could not be processed. Any reserved items have been restored to stock.',0,'2026-08-27 10:05:36'),(6,2,8,'ORDER_CONFIRMED','Order #ORD-1787844943887 Confirmed!','Your payment was successful. We are now processing your order for $3817.97',0,'2026-08-27 10:05:44'),(7,2,9,'PAYMENT_FAILED','Payment Failed for Order #ORD-1787845221977','Payment could not be processed. Any reserved items have been restored to stock.',0,'2026-08-27 10:10:22'),(8,2,10,'PAYMENT_FAILED','Payment Failed for Order #ORD-1787845225269','Payment could not be processed. Any reserved items have been restored to stock.',0,'2026-08-27 10:10:25'),(9,2,11,'ORDER_CONFIRMED','Order #ORD-1787845236063 Confirmed!','Your payment was successful. We are now processing your order for $1729',0,'2026-08-27 10:10:36');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,1,1749.00,'2026-08-27 15:22:10'),(2,2,1,'Aura Ultra Wireless ANC Headphones','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',249.99,1,249.99,'2026-08-27 15:22:10'),(3,2,16,'Designing Data-Intensive Applications','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',44.99,2,89.98,'2026-08-27 15:22:10'),(4,3,11,'Barista Touch Precision Espresso Machine','https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',699.00,1,699.00,'2026-08-27 15:22:10'),(5,4,13,'AromaPure Smart HEPA Air Purifier','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',159.99,1,159.99,'2026-08-27 15:22:10'),(6,5,3,'PixelPro 10 Ultra 5G (256GB)','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',899.00,1,899.00,'2026-08-27 15:22:10'),(7,6,1,'Aura Ultra Wireless ANC Headphones','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',249.99,1,249.99,'2026-08-27 10:05:33'),(8,6,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,2,3498.00,'2026-08-27 10:05:33'),(9,6,16,'Designing Data-Intensive Applications','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',44.99,2,89.98,'2026-08-27 10:05:33'),(10,7,1,'Aura Ultra Wireless ANC Headphones','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',249.99,1,249.99,'2026-08-27 10:05:36'),(11,7,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,2,3498.00,'2026-08-27 10:05:36'),(12,7,16,'Designing Data-Intensive Applications','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',44.99,2,89.98,'2026-08-27 10:05:36'),(13,8,1,'Aura Ultra Wireless ANC Headphones','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',249.99,1,249.99,'2026-08-27 10:05:44'),(14,8,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,2,3498.00,'2026-08-27 10:05:44'),(15,8,16,'Designing Data-Intensive Applications','https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',44.99,2,89.98,'2026-08-27 10:05:44'),(16,9,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,1,1749.00,'2026-08-27 10:10:22'),(17,10,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,1,1749.00,'2026-08-27 10:10:25'),(18,11,2,'ProBook Horizon 16-inch M3 Pro','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',1749.00,1,1749.00,'2026-08-27 10:10:36');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_number` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `shipping_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(12,2) NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CONFIRMED',
  `payment_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CARD',
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-20260810-1011',2,1749.00,0.00,50.00,1699.00,'DELIVERED','CARD','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-12 15:22:10','2026-08-27 15:22:10'),(2,'ORD-20260815-1022',2,339.97,0.00,0.00,339.97,'DELIVERED','UPI','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-17 15:22:10','2026-08-27 15:22:10'),(3,'ORD-20260820-1033',2,699.00,15.00,20.00,694.00,'SHIPPED','CARD','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-24 15:22:10','2026-08-27 15:22:10'),(4,'ORD-20260825-1044',2,159.99,0.00,10.00,149.99,'PROCESSING','NET_BANKING','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-26 15:22:10','2026-08-27 15:22:10'),(5,'ORD-20260827-1055',2,899.00,0.00,0.00,899.00,'CONFIRMED','UPI','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 15:22:10','2026-08-27 15:22:10'),(6,'ORD-1787844933163',2,3837.97,0.00,20.00,3817.97,'FAILED','COD','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 10:05:33','2026-08-27 10:05:33'),(7,'ORD-1787844935717',2,3837.97,0.00,20.00,3817.97,'FAILED','COD','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 10:05:36','2026-08-27 10:05:36'),(8,'ORD-1787844943887',2,3837.97,0.00,20.00,3817.97,'CONFIRMED','COD','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 10:05:44','2026-08-27 10:05:44'),(9,'ORD-1787845221977',2,1749.00,0.00,20.00,1729.00,'FAILED','UPI','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 10:10:22','2026-08-27 10:10:22'),(10,'ORD-1787845225269',2,1749.00,0.00,20.00,1729.00,'FAILED','UPI','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 10:10:25','2026-08-27 10:10:25'),(11,'ORD-1787845236063',2,1749.00,0.00,20.00,1729.00,'CONFIRMED','UPI','Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477','2026-08-27 10:10:36','2026-08-27 10:10:36');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUCCESS',
  `error_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,2,1699.00,'CARD','TXN-902148192834-VISA','SUCCESS',NULL,'2026-08-12 15:22:10','2026-08-27 15:22:10'),(2,2,2,339.97,'UPI','TXN-719284719203-UPI','SUCCESS',NULL,'2026-08-17 15:22:10','2026-08-27 15:22:10'),(3,3,2,694.00,'CARD','TXN-551029384756-MC','SUCCESS',NULL,'2026-08-24 15:22:10','2026-08-27 15:22:10'),(4,4,2,149.99,'NET_BANKING','TXN-109283746582-HDFC','SUCCESS',NULL,'2026-08-26 15:22:10','2026-08-27 15:22:10'),(5,5,2,899.00,'UPI','TXN-882910394857-UPI','SUCCESS',NULL,'2026-08-27 15:22:10','2026-08-27 15:22:10'),(6,6,2,3817.97,'COD','TXN-1787844933253-COD','FAILED','Payment simulation declined by test engine','2026-08-27 10:05:33','2026-08-27 10:05:33'),(7,7,2,3817.97,'COD','TXN-1787844935738-COD','FAILED','Payment simulation declined by test engine','2026-08-27 10:05:36','2026-08-27 10:05:36'),(8,8,2,3817.97,'COD','TXN-1787844943905-COD','SUCCESS',NULL,'2026-08-27 10:05:44','2026-08-27 10:05:44'),(9,9,2,1729.00,'UPI','TXN-1787845221987-UPI','FAILED','Payment simulation declined by test engine','2026-08-27 10:10:22','2026-08-27 10:10:22'),(10,10,2,1729.00,'UPI','TXN-1787845225277-UPI','FAILED','Payment simulation declined by test engine','2026-08-27 10:10:25','2026-08-27 10:10:25'),(11,11,2,1729.00,'UPI','TXN-1787845236072-UPI','SUCCESS',NULL,'2026-08-27 10:10:36','2026-08-27 10:10:36');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `discount_price` decimal(12,2) DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '4.50',
  `review_count` int DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Aura Ultra Wireless ANC Headphones','aura-ultra-wireless-anc-headphones','Premium active noise-cancelling over-ear headphones with 40-hour battery life and spatial audio fidelity.','ELEC-AUR-001','AuraSound',299.99,249.99,1,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',4.85,342,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(2,'ProBook Horizon 16-inch M3 Pro','probook-horizon-16-m3','Ultra-slim workstation laptop with 3.2K Liquid Retina display, 32GB unified RAM, and 1TB NVMe SSD.','ELEC-PBK-002','HorizonTech',1899.00,1749.00,1,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',4.92,189,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(3,'PixelPro 10 Ultra 5G (256GB)','pixelpro-10-ultra-5g','Next-generation flagship smartphone with computational AI 200MP camera system and LTPO OLED display.','ELEC-PXL-003','NovaMobile',999.00,899.00,1,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',4.78,512,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(4,'Chronos Elite Titanium Smartwatch','chronos-elite-titanium-smartwatch','Aerospace-grade titanium smartwatch featuring sapphire crystal, continuous ECG, and 14-day battery.','ELEC-CHR-004','Chronos',349.50,299.00,1,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',4.67,245,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(5,'SonicBoom Mini Bluetooth Speaker','sonicboom-mini-bluetooth-speaker','IPX7 waterproof rugged portable speaker delivering 360-degree high-definition sound with deep bass.','ELEC-SBM-005','SonicAudio',79.99,59.99,1,'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',4.55,128,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(6,'Tailored Italian Merino Wool Blazer','tailored-italian-merino-wool-blazer','Handcrafted slim-fit navy blazer spun from 100% fine Italian Merino wool with horn buttons.','FASH-BLZ-006','Vincenzo Milano',320.00,269.00,2,'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',4.80,78,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(7,'Urban Luxe Minimalist White Sneakers','urban-luxe-minimalist-white-sneakers','Full-grain calfskin leather low-top sneakers with cushioned OrthoLite insole and vulcanized rubber sole.','FASH-SNK-007','Strider Lab',145.00,120.00,2,'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500',4.71,310,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(8,'Organic Pima Cotton Crewneck Tee (3-Pack)','organic-pima-cotton-crewneck-tee-3pk','Luxuriously soft, breathable heavyweight organic Pima cotton tees in black, heather grey, and white.','FASH-TEE-008','EcoEssentials',65.00,49.99,2,'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',4.62,415,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(9,'Classic Heritage Trench Coat','classic-heritage-trench-coat','Double-breasted weatherproof cotton gabardine trench coat with vintage check lining and belted cuffs.','FASH-TRN-009','Savile Row Co.',280.00,235.00,2,'https://images.unsplash.com/photo-1544441893-675973e31985?w=500',4.88,92,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(10,'Athletic Performance Tech Joggers','athletic-performance-tech-joggers','Four-way stretch moisture-wicking joggers with concealed zip pockets and ergonomic tapered fit.','FASH-JOG-010','AeroFlex',85.00,68.00,2,'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500',4.58,204,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(11,'Barista Touch Precision Espresso Machine','barista-touch-precision-espresso-machine','Dual boiler commercial-grade espresso machine with digital PID thermal control and integrated grinder.','HOME-ESP-011','CremaTech',799.00,699.00,3,'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',4.90,156,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(12,'Cast Iron Enameled Dutch Oven (6 Qt)','cast-iron-enameled-dutch-oven-6qt','Heirloom quality enameled cast iron Dutch oven for superior heat retention and slow braising.','HOME-DTC-012','Le Maison Cook',180.00,149.00,3,'https://images.unsplash.com/photo-1584990347449-397a61d1544a?w=500',4.86,280,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(13,'AromaPure Smart HEPA Air Purifier','aromapure-smart-hepa-air-purifier','Medical-grade H13 true HEPA filter removes 99.97% of airborne allergens with smart app control.','HOME-APR-013','PureAir Labs',199.99,159.99,3,'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',4.74,198,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(14,'Ergonomic Natural Bamboo Standing Desk','ergonomic-natural-bamboo-standing-desk','Motorized dual-motor height adjustable standing desk with solid bamboo top and memory presets.','HOME-DSK-014','ErgoWorkspace',450.00,389.00,3,'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500',4.82,114,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(15,'Nordic Minimalist Ceramic Dinnerware Set','nordic-minimalist-ceramic-dinnerware-set','16-piece matte stoneware collection including dinner plates, salad bowls, and handcrafted mugs.','HOME-DIN-015','Kobenhavn Studio',129.00,99.00,3,'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500',4.65,87,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(16,'Designing Data-Intensive Applications','designing-data-intensive-applications','The definitive guide to distributed systems architecture, reliable storage, and streaming data.','BOOK-DDIA-016','O Reilly Media',54.99,44.99,4,'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',4.98,890,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(17,'Clean Code: A Handbook of Agile Craftsmanship','clean-code-handbook','Robert C. Martin legendary guide to writing readable, maintainable, and elegant software systems.','BOOK-CLNC-017','Prentice Hall',49.99,39.99,4,'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=500',4.89,1240,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(18,'Atomic Habits by James Clear','atomic-habits-james-clear','An easy and proven way to build good habits, break bad ones, and achieve remarkable compound growth.','BOOK-ATHB-018','Avery Publishing',27.00,19.99,4,'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',4.95,2300,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(19,'System Design Interview ÔÇô Volume 1 & 2','system-design-interview-insiders-guide','Master large-scale system design concepts, microservices patterns, and caching strategies.','BOOK-SYSD-019','ByteByteGo',75.00,59.99,4,'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500',4.94,620,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(20,'PowerGrip Adjustable Dumbbell Set (5-52.5 lbs)','powergrip-adjustable-dumbbell-set','Space-saving rapid weight selection dial dumbbell pair replacing 15 separate sets of free weights.','SPRT-DMB-020','IronVault',399.00,329.00,5,'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500',4.84,310,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(21,'ProForm High-Density Eco Yoga Mat (6mm)','proform-high-density-eco-yoga-mat','Non-slip textured surface made from sustainably harvested natural tree rubber with alignment guides.','SPRT-YOG-021','ZenAthletics',68.00,49.00,5,'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',4.70,185,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(22,'HydroTrail Insulated Stainless Steel Bottle (32oz)','hydrotrail-insulated-stainless-bottle-32oz','Double-wall vacuum insulation keeps beverages iced for 24 hours or steaming hot for 12 hours.','SPRT-BTL-022','Summit Gear',38.00,29.99,5,'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',4.78,540,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(23,'SpeedMaster Smart Jump Rope with OLED Display','speedmaster-smart-jump-rope','Precision ball bearings, steel wire cable, and real-time Bluetooth rotation counter syncing to mobile app.','SPRT-JMP-023','AeroSpeed',42.00,34.00,5,'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500',4.52,98,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(24,'Botanical Radiance Vitamin C Serum (30ml)','botanical-radiance-vitamin-c-serum','Potent 20% L-Ascorbic acid with Ferulic acid and hyaluronic acid for luminous skin tone brightening.','BEAU-SRM-024','Lumiere Botanical',58.00,46.00,6,'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',4.81,410,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(25,'Santale Royal Eau de Parfum (100ml)','santale-royal-eau-de-parfum','Exquisite artisanal fragrance blending creamy sandalwood, smoked amber, and Damascus rose.','BEAU-PRF-025','Maison Noir',165.00,139.00,6,'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',4.91,142,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(26,'Ionic Sonic Electric Toothbrush with Travel Case','ionic-sonic-electric-toothbrush','40,000 VPM ultrasonic motor, wireless inductive charging dock, and 4 brushing modes.','BEAU-TBS-026','DentPulse',89.00,69.00,6,'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500',4.68,220,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(27,'Nourishing Organic Argan Hair Oil (100ml)','nourishing-organic-argan-hair-oil','Cold-pressed virgin Moroccan argan oil enriched with vitamin E for silky frizz control.','BEAU-ARG-027','Atlas Pure',34.00,26.50,6,'https://images.unsplash.com/photo-1608248597359-598d9e2617f6?w=500',4.63,175,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(28,'Ethiopian Yirgacheffe Single-Origin Beans (1kg)','ethiopian-yirgacheffe-coffee-beans-1kg','Lightly roasted specialty beans with delicate jasmine floral aroma and sweet blueberry notes.','GROC-COF-028','Altitude Roasters',36.00,29.50,7,'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',4.93,388,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(29,'Raw New Zealand Manuka Honey UMF 15+ (250g)','raw-manuka-honey-umf-15','Certified 100% pure authentic raw Manuka honey with potent natural antibacterial bio-activity.','GROC-HNY-029','Kiwi Reserve',62.00,49.99,7,'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',4.87,215,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(30,'Cold-Pressed Extra Virgin Olive Oil PDO (750ml)','cold-pressed-extra-virgin-olive-oil-pdo','Single-estate early harvest Koroneiki olives with peppery finish and polyphenol richness.','GROC-EVO-030','Aegean Gold',28.00,22.00,7,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',4.79,160,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(31,'Imperial Ceremonial Grade Uji Matcha (50g)','imperial-ceremonial-grade-uji-matcha','First-harvest shade-grown stone-ground Japanese green tea powder with vibrant emerald hue.','GROC-MTC-031','Kyoto Tradition',44.00,35.00,7,'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500',4.88,290,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(32,'Full-Grain Tuscan Leather Messenger Bag','full-grain-tuscan-leather-messenger-bag','Vegetable-tanned full grain leather briefcase with padded 15-inch laptop compartment.','ACCS-BAG-032','Artigiano Firenze',260.00,219.00,8,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',4.92,118,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(33,'Aviation Polarized Titanium Sunglasses','aviation-polarized-titanium-sunglasses','Ultra-lightweight titanium frames with anti-reflective polarized UV400 lenses.','ACCS-SNG-033','Solstice Optics',175.00,139.00,8,'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',4.75,230,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(34,'Minimalist RFID-Blocking Slim Cardholder','minimalist-rfid-blocking-slim-cardholder','Machined aerospace aluminum wallet with quick-draw card ejection mechanism.','ACCS-WLT-034','VaultCore',48.00,38.00,8,'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',4.67,460,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(35,'Automatic Skeleton Mechanical Watch','automatic-skeleton-mechanical-watch','Self-winding 24-jewel movement visible through sapphire exhibition caseback.','ACCS-SKL-035','Chronos Atelier',420.00,350.00,8,'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',4.86,94,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(36,'Silk Jacquard Geometric Woven Necktie','silk-jacquard-geometric-woven-necktie','Hand-stitched 100% mulberry silk tie with micro-geometric motif and wool interlining.','ACCS-TIE-036','Savile Row Co.',55.00,42.00,8,'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500',4.70,82,'ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(37,'4rf','4rf','High quality product specifications.','PROD-5869','Brandfrf',99.99,44.00,1,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',4.50,0,'ACTIVE','2026-08-27 10:09:02','2026-08-27 10:09:02');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_ADMIN','System Administrator with full access'),(2,'ROLE_CUSTOMER','Standard customer account');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `auth_user_id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_id` (`auth_user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,1,'Admin User','admin@shopsphere.com','+1 (555) 019-2834','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150','ShopSphere System Administrator','2026-08-27 15:22:10','2026-08-27 15:22:10'),(2,2,'Jane Doe','customer@shopsphere.com','+1 (555) 438-9210','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150','Verified Customer','2026-08-27 15:22:10','2026-08-27 15:22:10');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@shopsphere.com','$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWChYq',1,'+1 (555) 019-2834','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10'),(2,'Jane Doe','customer@shopsphere.com','$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWChYq',2,'+1 (555) 438-9210','ACTIVE','2026-08-27 15:22:10','2026-08-27 15:22:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-27 21:16:21
