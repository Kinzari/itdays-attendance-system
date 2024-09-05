-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2024 at 07:43 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `it_days_attendance`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `family_name` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `year_level` varchar(20) NOT NULL,
  `tribu` varchar(50) NOT NULL,
  `check_in` time NOT NULL,
  `check_out` time DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `day` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `first_name`, `middle_name`, `family_name`, `suffix`, `year_level`, `tribu`, `check_in`, `check_out`, `status`, `day`) VALUES
(41, '02-2223-03206', 'Van Morre', 'Acaylar', 'Guangco', '', '3rd Year', 'Mage', '01:42:04', '01:42:13', 'Complete', 1);

-- --------------------------------------------------------

--
-- Table structure for table `attendance_archive`
--

CREATE TABLE `attendance_archive` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `family_name` varchar(255) NOT NULL,
  `suffix` varchar(255) DEFAULT NULL,
  `year_level` varchar(255) NOT NULL,
  `tribu` varchar(255) NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('Complete','Incomplete') NOT NULL,
  `day` int(11) NOT NULL,
  `archived_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_archive`
--

INSERT INTO `attendance_archive` (`id`, `student_id`, `first_name`, `middle_name`, `family_name`, `suffix`, `year_level`, `tribu`, `check_in`, `check_out`, `status`, `day`, `archived_on`) VALUES
(1, '02-2021-00143', 'James', '', 'Antipuesto', '', '3rd Year', 'Fighter', '04:07:24', '04:44:05', 'Complete', 1, '2024-09-05 17:26:03'),
(2, '02-1920-10045', 'Rasidin', '', 'Ansao', '', '3rd Year', 'Support', '14:43:37', '14:48:49', 'Complete', 1, '2024-09-05 17:26:03'),
(3, '02-2425-00003', 'Pitok', 'Kulas', 'Batolata', '', '4th Year', 'Assassin', '14:47:43', '14:48:06', 'Complete', 1, '2024-09-05 17:26:03'),
(4, '02-2223-01945', 'Laurenz', '', 'Anchez', '', '3rd Year', 'Jungle', '20:26:14', '20:26:27', 'Complete', 1, '2024-09-05 17:26:03'),
(5, '02-2223-03206', 'Van Morre', 'Acaylar', 'Guangco', '', '3rd Year', 'Mage', '01:10:03', '01:10:27', 'Complete', 1, '2024-09-05 17:26:03'),
(8, '02-2223-03206', 'Van Morre', 'Acaylar', 'Guangco', '', '3rd Year', 'Mage', '01:29:21', '01:30:27', 'Complete', 2, '2024-09-05 17:30:37'),
(9, '02-2223-03206', 'Van Morre', 'Acaylar', 'Guangco', '', '3rd Year', 'Mage', '01:35:32', '01:35:54', 'Complete', 1, '2024-09-05 17:36:07'),
(10, '02-2223-03206', 'Van Morre', 'Acaylar', 'Guangco', '', '3rd Year', 'Mage', '01:38:01', '01:38:11', 'Complete', 2, '2024-09-05 17:39:09');

-- --------------------------------------------------------

--
-- Table structure for table `event_status`
--

CREATE TABLE `event_status` (
  `id` int(11) NOT NULL,
  `current_day` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_status`
--

INSERT INTO `event_status` (`id`, `current_day`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `family_name` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `contact_info` varchar(100) NOT NULL,
  `year_level` tinyint(4) NOT NULL,
  `tribu_id` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phinmaed_email` varchar(100) NOT NULL,
  `roles` varchar(20) NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `first_name`, `middle_name`, `family_name`, `suffix`, `contact_info`, `year_level`, `tribu_id`, `password`, `phinmaed_email`, `roles`) VALUES
(17, '02-0000-00000', 'Test', '', 'Student', '', '09123456789', 1, 1, '$2y$10$K8GfDGyHJdve3tiDNVCOYOf4A/MRE/dhSJ1vPzKiAu38.K6XLzmQK', 'teststudent.coc@phinmaed.com', 'admin'),
(19, '02-1920-10045', 'Rasidin', '', 'Ansao', '', '09045691046', 3, 7, '$2y$10$ef0xa/LOrJqSPetWxg4z7urbTot66Yl5CLw4fcmXGnhvxKC.UGSDG', 'ras.ansaon.coc@phinmaed.com', 'student'),
(21, '02-2223-03206', 'Van Morre', 'Acaylar', 'Guangco', '', '09582749102', 3, 4, '$2y$10$swIffWAlSTdzJdRJug2QZeZcI23fzOjzpjx5O/SuFMe0mgOHTm1Hm', 'vaac.guangco.coc@phinmaed.com', 'student'),
(22, '02-2223-05976', 'Jerimiah Exequiel', '', 'Espartero', '', '09157079861', 3, 7, '$2y$10$hm8oH5IUlXwLOWm5ON97Med6DWwT49/DHV4K5xTFSmAu2ctGU06cO', 'jeex.espartero.coc@phinmaed.com', 'sbo'),
(23, '02-2021-00143', 'James', '', 'Antipuesto', '', '09382901129', 3, 2, '$2y$10$hZ0ejsdlFAran2cRWGho9uX048xUbCUoOkifXR8OSJbzB/tV20JWS', 'ja.antipuesto.coc@phinmaed.com', 'student'),
(24, '02-2425-00003', 'Pitok', 'Kulas', 'Batolata', '', '09123456789', 4, 1, '$2y$10$iOuF3STiya9KOwtrGHBLluEgAMXj5ICmLEPdL3XVJ16dbrLh4jS3i', 'pitok.batolata.coc@phinmaed.com', 'student'),
(25, '02-2223-01945', 'Laurenz', '', 'Anchez', '', '09574920122', 3, 3, '$2y$10$N.TTAHhfgJ4nr.8/R7lz4OtR9Tv3raxJYrccEE.BlMxIlCxGBGYeq', 'la.anchez.coc@phinmaed.com', 'student');

-- --------------------------------------------------------

--
-- Table structure for table `tribus`
--

CREATE TABLE `tribus` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tribus`
--

INSERT INTO `tribus` (`id`, `name`) VALUES
(1, 'Assassin'),
(2, 'Fighter'),
(3, 'Jungle'),
(4, 'Mage'),
(5, 'Magic'),
(6, 'Marksman'),
(7, 'Support'),
(8, 'Tank');

-- --------------------------------------------------------

--
-- Table structure for table `year_levels`
--

CREATE TABLE `year_levels` (
  `id` tinyint(4) NOT NULL,
  `level_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_levels`
--

INSERT INTO `year_levels` (`id`, `level_name`) VALUES
(1, '1st Year'),
(2, '2nd Year'),
(3, '3rd Year'),
(4, '4th Year');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_archive`
--
ALTER TABLE `attendance_archive`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_status`
--
ALTER TABLE `event_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `year_level` (`year_level`),
  ADD KEY `tribu_id` (`tribu_id`);

--
-- Indexes for table `tribus`
--
ALTER TABLE `tribus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `year_levels`
--
ALTER TABLE `year_levels`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `attendance_archive`
--
ALTER TABLE `attendance_archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `event_status`
--
ALTER TABLE `event_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tribus`
--
ALTER TABLE `tribus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`year_level`) REFERENCES `year_levels` (`id`),
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`tribu_id`) REFERENCES `tribus` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
