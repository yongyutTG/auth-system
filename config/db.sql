
-- Active: 1725641274728@@127.0.0.1@3306@employee_leave_system


-- signin
CREATE TABLE `employees` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empid` varchar(255) NOT NULL DEFAULT '''0''',
    `firstname` varchar(100) NOT NULL,
    `lastname` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `position` varchar(100) NOT NULL,
    `start_date` date NOT NULL,
    `password` varchar(255) NOT NULL,
    `remaining_leaves` int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci

-- อนุมัติลา
CREATE TABLE `leave_approvals` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `leave_request_id` int(11) NOT NULL,
    `approved_by` int(11) NOT NULL,
    `approved_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `comments` text DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `leave_request_id` (`leave_request_id`),
    KEY `approved_by` (`approved_by`),
    CONSTRAINT `leave_approvals_ibfk_1` FOREIGN KEY (`leave_request_id`) REFERENCES `leave_requests` (`id`),
    CONSTRAINT `leave_approvals_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci

-- ใบคำขอลา
CREATE TABLE `leave_requests` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `employee_id` int(11) NOT NULL,
    `leave_type_id` int(11) NOT NULL,
    `start_date` date NOT NULL,
    `end_date` date NOT NULL,
    `reason` text NOT NULL,
    `status` enum(
        'pending',
        'approved',
        'rejected'
    ) DEFAULT 'pending',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `employee_id` (`employee_id`),
    KEY `leave_type_id` (`leave_type_id`),
    CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
    CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci


CREATE TABLE `leave_types` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci