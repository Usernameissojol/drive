-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2026 at 03:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drivestudio`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_providers`
--

CREATE TABLE `api_providers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `api_url` varchar(500) NOT NULL,
  `api_key` varchar(500) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `icon` varchar(50) DEFAULT 'cloud',
  `color` varchar(50) DEFAULT '#0ea5e9',
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_providers`
--

INSERT INTO `api_providers` (`id`, `name`, `label`, `api_url`, `api_key`, `status`, `icon`, `color`, `is_active`, `sort_order`, `created_at`) VALUES
('ddbcefbd-bfe2-412a-b3ff-5259701df23c', 'DriveCloud Primary', 'Fast Download', 'http://new.drivecloud.cc/api/v1', '2328a4b69080a0475f1dfac6e00437e9', 'active', 'zap', '#22c55e', 1, 0, '2026-05-11 15:41:55');

-- --------------------------------------------------------

--
-- Table structure for table `drive_files`
--

CREATE TABLE `drive_files` (
  `id` varchar(36) NOT NULL,
  `drive_id` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `download_url` text DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filesize` varchar(50) DEFAULT NULL,
  `status` enum('processing','ready','error') NOT NULL DEFAULT 'processing',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drive_files`
--

INSERT INTO `drive_files` (`id`, `drive_id`, `token`, `download_url`, `filename`, `filesize`, `status`, `error_message`, `created_at`, `user_id`) VALUES
('58c1bf8f-c68e-4019-95e7-a1b260e97b49', '1Sa4w4Mx4Qf3OKmG1_3y5TVVkVBPcK-0l', 'xWaPGPSaVQk', 'https://m.drivecloud.io/file/xWaPGPSaVQk', '27-02.mp4', '79.3 MB', 'ready', NULL, '2026-05-11 11:15:45', '8a9115a2-a54e-415d-9337-22a880411229'),
('a41328d4-ae0b-46c7-ba41-a820ed3443a3', '1Sa4w4Mx4Qf3OKmG1_3y5TVVkVBPcK-0l', 'xWaPGPSaVQk', 'https://m.drivecloud.io/file/xWaPGPSaVQk', '27-02.mp4', '79.3 MB', 'ready', NULL, '2026-05-11 11:15:48', '8a9115a2-a54e-415d-9337-22a880411229'),
('dc4324d5-e666-4313-bfe8-874ac014a004', '1vriTksTKmeNgv8HxIovrC-gMB4Hnjaaq', 'Ox-Jd_5kI5s', '/download/dc4324d5-e666-4313-bfe8-874ac014a004', '2026_06_14_21_29_00.wav', '14.3 MB', 'ready', NULL, '2026-06-14 16:39:57', '06bc543f-5858-4d7e-978f-b5dadb74c86a');

-- --------------------------------------------------------

--
-- Table structure for table `error_logs`
--

CREATE TABLE `error_logs` (
  `id` varchar(36) NOT NULL,
  `drive_id` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `error_logs`
--

INSERT INTO `error_logs` (`id`, `drive_id`, `message`, `details`, `created_at`, `user_id`) VALUES
('3356c636-6768-4ced-9f60-521a6e2e4ff4', '1weG-ycvbYqVfSdGpXLh7hQp2kSzHFIvw', 'API error (502) from DriveCloud Primary', '{\"provider\":\"DriveCloud Primary\",\"status\":502,\"body\":\"<!DOCTYPE html>\\n<!--[if lt IE 7]> <html class=\\\"no-js ie6 oldie\\\" lang=\\\"en-US\\\"> <![endif]-->\\n<!--[if IE 7]>    <html class=\\\"no-js ie7 oldie\\\" lang=\\\"en-US\\\"> <![endif]-->\\n<!--[if IE 8]>    <html class=\\\"no-js ie8 oldie\\\" lang=\\\"en-US\\\"> <![endif]-->\\n<!--[if gt IE 8]><!--> <html class=\\\"no-js\\\" lang=\\\"en-US\\\"> <!--<![endif]-->\\n<head>\\n\\n<title>drivecloud.cc | 502: Bad gateway</title>\\n<meta charset=\\\"UTF-8\\\" />\\n<meta http-equiv=\\\"Content-Type\\\" content=\\\"text/html; charset=UTF-8\\\" />\\n<meta http-equiv=\\\"X-UA-Compatible\\\"\"}', '2026-06-14 16:34:17', '06bc543f-5858-4d7e-978f-b5dadb74c86a');

-- --------------------------------------------------------

--
-- Table structure for table `file_links`
--

CREATE TABLE `file_links` (
  `id` varchar(36) NOT NULL,
  `file_id` varchar(36) NOT NULL,
  `provider_id` varchar(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `download_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `file_links`
--

INSERT INTO `file_links` (`id`, `file_id`, `provider_id`, `token`, `download_url`, `created_at`) VALUES
('11e0a286-7f86-4c22-9055-be3a3f1a0417', 'dc4324d5-e666-4313-bfe8-874ac014a004', 'ddbcefbd-bfe2-412a-b3ff-5259701df23c', 'Ox-Jd_5kI5s', 'https://m.drivecloud.io/file/Ox-Jd_5kI5s', '2026-06-14 16:39:57');

-- --------------------------------------------------------

--
-- Table structure for table `file_provider_links`
--

CREATE TABLE `file_provider_links` (
  `id` varchar(36) NOT NULL,
  `file_id` varchar(36) NOT NULL,
  `provider_id` varchar(36) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `download_url` text DEFAULT NULL,
  `status` enum('processing','ready','error') DEFAULT 'processing',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `message` text DEFAULT NULL,
  `type` enum('success','error','info','warning') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
('3594e7d6-e51f-4e29-b5d2-68366d0cc5c0', '06bc543f-5858-4d7e-978f-b5dadb74c86a', 'Links Generated', 'Successfully processed 1 file(s).', 'success', 1, '2026-06-14 08:51:08'),
('4f7bb1f7-33f9-4c01-92c5-bec979d1cfbe', '06bc543f-5858-4d7e-978f-b5dadb74c86a', 'Links Generated', 'Successfully processed 1 file(s).', 'success', 1, '2026-05-11 16:31:18'),
('6dceba35-22a8-49c1-9c25-338d65343d16', '06bc543f-5858-4d7e-978f-b5dadb74c86a', 'Links Generated', 'Successfully processed 1 file(s).', 'success', 0, '2026-06-14 16:39:57'),
('800962ac-6222-44aa-8e94-2c875ed3a423', '3db905d2-a9c2-458e-8755-cd34230689bb', 'Links Generated', 'Successfully processed 1 file(s).', 'success', 1, '2026-05-11 11:13:33'),
('8b4b6620-a7c4-43de-9dcd-890458b22eee', '8a9115a2-a54e-415d-9337-22a880411229', 'Links Generated', 'Successfully processed 1 file(s).', 'success', 0, '2026-05-11 11:15:45'),
('97c00b96-7724-4ebd-bfef-ced044617ec5', 'e71b75f7-37ca-4620-bc0d-41da3c58bb99', 'Profile Updated', 'Your profile information has been saved.', 'success', 0, '2026-06-14 12:59:41'),
('9d6cd8f9-6200-4a03-932b-027b1201519c', '8a9115a2-a54e-415d-9337-22a880411229', 'Links Generated', 'Successfully processed 1 file(s).', 'success', 0, '2026-05-11 11:15:48'),
('f96a0557-28d5-4ee1-9596-c60fae716208', '06bc543f-5858-4d7e-978f-b5dadb74c86a', 'Generation Failed', 'Failed to process 1 file(s). Check error logs for details.', 'error', 0, '2026-06-14 16:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`key`, `value`) VALUES
('ads_banner_728x90', '<script>\n  atOptions = {\n    \'key\' : \'975c07827d933d8635497d6be6b82b23\',\n    \'format\' : \'iframe\',\n    \'height\' : 90,\n    \'width\' : 728,\n    \'params\' : {}\n  };\n</script>\n<script src=\"https://www.highperformanceformat.com/975c07827d933d8635497d6be6b82b23/invoke.js\"></script>\n'),
('ads_direct_link', ''),
('ads_native_banner', '<script async=\"async\" data-cfasync=\"false\" src=\"https://pl29476752.effectivecpmnetwork.com/30f95cd7e182c1320ee157b8c1c0448c/invoke.js\"></script>\n<div id=\"container-30f95cd7e182c1320ee157b8c1c0448c\"></div>\n'),
('ads_popunder', '<script src=\"https://pl29476749.effectivecpmnetwork.com/9a/dc/23/9adc2371653229cb6ef0799150f9076d.js\"></script>\n'),
('ads_social_bar', '<script src=\"https://pl29476750.effectivecpmnetwork.com/ca/43/f4/ca43f403f427f5d0894f4cb0da1adb95.js\"></script>\n'),
('api_key', '2328a4b69080a0475f1dfac6e00437e9');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `avatar_url`) VALUES
('06bc543f-5858-4d7e-978f-b5dadb74c86a', 'Admin', 'admin@gmail.com', 'admin123', 'admin', '2026-05-11 10:35:23', NULL),
('82324291-9b82-41bd-b851-c0355e2f9959', 'SOJOL HOSSAIN', 'computerhouse008@gmail.com', 'sojol123', 'user', '2026-06-14 09:59:13', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_providers`
--
ALTER TABLE `api_providers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `drive_files`
--
ALTER TABLE `drive_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `error_logs`
--
ALTER TABLE `error_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `file_links`
--
ALTER TABLE `file_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `file_provider_links`
--
ALTER TABLE `file_provider_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_file_id` (`file_id`),
  ADD KEY `idx_provider_id` (`provider_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `file_links`
--
ALTER TABLE `file_links`
  ADD CONSTRAINT `file_links_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `drive_files` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `file_links_ibfk_2` FOREIGN KEY (`provider_id`) REFERENCES `api_providers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
