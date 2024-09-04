-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 04, 2024 at 03:55 PM
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
  `student_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `family_name` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `check_in` datetime NOT NULL,
  `check_out` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(22, '02-2223-05976', 'Jerimiah Exequiel', '', 'Espartero', '', '09157079861', 3, 7, '$2y$10$hm8oH5IUlXwLOWm5ON97Med6DWwT49/DHV4K5xTFSmAu2ctGU06cO', 'jeex.espartero.coc@phinmaed.com', 'sbo');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tribus`
--
ALTER TABLE `tribus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

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
