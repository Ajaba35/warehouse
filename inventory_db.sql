-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 12:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `code`, `name`) VALUES
(32, 'CAT-573987', 'Accessories'),
(33, 'CAT-720013', 'Gaming Gear'),
(34, 'CAT-773601', 'Gaming Furniture'),
(35, 'CAT-525529', 'Merchandise'),
(36, 'CAT-690003', 'Audio Gear');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `code`, `name`, `location`, `phone`) VALUES
(22, 'CS-347002', 'Cyber Atlas', 'Agadir', '+212 6 00 00 00 00'),
(23, 'CS-703519', 'GameZone Rabat', 'Rabat', '+212 6 00 00 00 00'),
(24, 'CS-302286', 'Hotel Al Koutoubia', 'Marrakech', '+212 6 00 00 00 00'),
(25, 'CS-350582', 'Pixel Play Café', 'Casablanca', '+212 6 00 00 00 00'),
(26, 'CS-457713', 'NerdSpace Marrakech', 'Marrakech', '+212 6 00 00 00 00'),
(27, 'CS-830845', 'TechBazaar Casablanca', 'Casablanca', '+212 6 00 00 00 00'),
(28, 'CS-132557', 'Oasis Gamers', 'Tanger', '+212 6 00 00 00 00'),
(29, 'CS-161692', 'CityPlay Safi', 'Safi', '+212 6 00 00 00 00'),
(30, 'CS-560261', 'NextLevel Fnideq', 'Fnideq', '+212 6 00 00 00 00'),
(31, 'CS-816419', 'Digital Lounge Agadir', 'Agadir', '+212 6 00 00 00 00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `qte_sold` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `code`, `name`, `category_id`, `price`, `stock`, `qte_sold`) VALUES
(86, 'PR-911207', 'DualShock 4 Charging Dock', 32, 120.00, 20, 20),
(87, 'PR-472137', 'Xbox Controller Grip Case', 32, 65.00, 130, 0),
(88, 'PR-469430', 'Razer Viper Mini Mouse', 33, 280.00, 275, 25),
(89, 'PR-729738', 'ASUS TUF Gaming Keyboard', 33, 420.00, 120, 0),
(90, 'PR-113859', 'ErgoX RGB Gaming Chair', 34, 1150.00, 100, 0),
(91, 'PR-633384', 'Compact Gaming Desk 120cm', 34, 890.00, 180, 50),
(92, 'PR-436647', 'Zelda Logo T-Shirt Black', 35, 90.00, 0, 0),
(93, 'PR-115257', 'Mario Mug with Lid', 35, 55.00, 0, 0),
(94, 'PR-861859', 'HyperX Cloud Core Headset', 36, 490.00, 0, 0),
(96, 'PR-971830', 'Fifine USB Streaming Mic', 36, 320.00, 0, 0),
(97, 'PR-281902', 'LED Gaming Mouse Pad XL', 32, 140.00, 0, 0),
(98, 'PR-648890', 'PS5 DualSense Controller', 33, 540.00, 95, 25),
(99, 'PR-757502', 'RGB Headset Stand Base', 36, 180.00, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `supplier` int(11) DEFAULT NULL,
  `product` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `code`, `date`, `supplier`, `product`, `quantity`, `unit_price`, `total_price`) VALUES
(13, 'PCH-530288', '2025-05-11', 8, 86, 40, 65.00, 2600.00),
(14, 'PCH-266932', '2025-05-11', 9, 87, 130, 28.00, 3640.00),
(15, 'PCH-703180', '2025-05-11', 9, 88, 300, 180.00, 54000.00),
(16, 'PCH-457241', '2025-05-11', 9, 89, 120, 290.00, 34800.00),
(17, 'PCH-501891', '2025-05-11', 8, 98, 120, 390.00, 46800.00),
(18, 'PCH-677071', '2025-05-11', 10, 90, 100, 780.00, 78000.00),
(19, 'PCH-277115', '2025-05-11', 10, 91, 230, 620.00, 142600.00);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `customer` int(11) DEFAULT NULL,
  `product` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `code`, `date`, `customer`, `product`, `quantity`, `total_price`) VALUES
(81, 'SALE-556600', '2025-05-11 20:46:51', 22, 86, 20, 2400.00),
(82, 'SALE-163400', '2025-05-11 20:47:05', 26, 91, 10, 8900.00),
(83, 'SALE-165657', '2025-05-11 20:47:32', 30, 91, 30, 26700.00),
(84, 'SALE-276695', '2025-05-11 20:47:42', 31, 91, 10, 8900.00),
(85, 'SALE-286938', '2025-05-11 20:47:50', 27, 98, 10, 5400.00),
(86, 'SALE-164202', '2025-05-11 20:47:59', 24, 98, 15, 8100.00),
(87, 'SALE-849444', '2025-05-11 20:48:13', 25, 88, 20, 5600.00),
(88, 'SALE-674145', '2025-05-11 20:49:01', 22, 88, 5, 1400.00);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `code`, `name`, `location`, `phone`) VALUES
(8, 'SPL-761714', 'ConsoleDirect Wholesale', 'Agadir', '+212 6 00 00 00 00'),
(9, 'SPL-928471', 'Apex PC Components', 'Casablanca', '+212 6 00 00 00 00'),
(10, 'SPL-937018', 'GameStation Furniture Co', 'Rabat', '+212 6 00 00 00 00'),
(11, 'SPL-122907', 'Pixel Merch Suppliers', 'Tanger', '+212 6 00 00 00 00'),
(12, 'SPL-772725', 'SoundCore Gaming Supply', 'Rabat', '+212 6 00 00 00 00');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `system_name` varchar(100) NOT NULL,
  `default_currency` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `system_name`, `default_currency`, `created_at`) VALUES
(1, 'Inventory', 'MAD', '2025-05-11 13:58:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `role`, `created_at`) VALUES
(44, 'Ayoub Ajaba', 'admin@gmail.com', '$2b$10$0Pe3nUXFOtlsU4gU6BtF6e56EQ4HEheWMdSQJS4plggkFLtKtR.Z2', 'admin', '2025-05-11 20:04:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fullname` (`fullname`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
