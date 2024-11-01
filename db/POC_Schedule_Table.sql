
CREATE TABLE POC_Schedules (
    Schedule_ID INT PRIMARY KEY AUTO_INCREMENT,
    POC_ID INT,
    Day_of_Week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    Start_Time TIME,
    End_Time TIME,
    appointments_per_slot INT,
    slot_duration INT,
    FOREIGN KEY (POC_ID) REFERENCES POC(POC_ID) ON DELETE CASCADE
);
INSERT INTO POC_Schedules (POC_ID, Day_of_Week, start_time, end_time, slot_duration, appointments_per_slot)
VALUES
(1, 'Monday', '10:00:00', '12:00:00', 30, 3), 
(1, 'Monday', '14:00:00', '17:00:00', 30, 3), 
(1, 'Tuesday', '10:00:00', '12:00:00', 30, 3),
(1, 'Tuesday', '14:00:00', '17:00:00', 30, 3),
(1, 'wednesday', '10:00:00', '12:00:00', 30, 3),
(1, 'wednesday', '14:00:00', '17:00:00', 30, 3),
(1, 'Thursday', '10:00:00', '12:00:00', 30, 3),
(1, 'Thursday', '14:00:00', '17:00:00', 30, 3),
(1, 'Friday', '10:00:00', '12:00:00', 30, 3),
(1, 'Friday', '14:00:00', '17:00:00', 30, 3);
-- Doctor 2: Dr. Preet Jones (Orthopedics)
INSERT INTO POC_Schedules (POC_ID, Day_of_Week, start_time, end_time, slot_duration, appointments_per_slot)
VALUES
(2, 'Monday', '10:00:00', '12:00:00', 30, 6), 
(2, 'Monday', '14:00:00', '17:00:00', 30, 6), 
(2, 'Tuesday', '10:00:00', '12:00:00', 30, 6),
(2, 'Tuesday', '14:00:00', '17:00:00', 30, 6),
(2, 'wednesday', '10:00:00', '12:00:00', 30, 6),
(2, 'wednesday', '14:00:00', '17:00:00', 30, 6),
(2, 'Thursday', '10:00:00', '12:00:00', 30, 6),
(2, 'Thursday', '14:00:00', '17:00:00', 30, 6);

-- Doctor 3: Dr. Praggy Davis (Pediatrics)
INSERT INTO POC_Schedules (POC_ID, Day_of_Week, start_time, end_time, slot_duration, appointments_per_slot)
VALUES
(3, 'Monday', '10:00:00', '12:00:00', 30, 2), 
(3, 'Monday', '14:00:00', '17:00:00', 30, 2), 
(3, 'Tuesday', '10:00:00', '12:00:00', 30, 2),
(3, 'Tuesday', '14:00:00', '17:00:00', 30, 2),
(3, 'wednesday', '10:00:00', '12:00:00', 30, 2),
(3, 'wednesday', '14:00:00', '17:00:00', 30, 2),
(3, 'Thursday', '10:00:00', '12:00:00', 30, 2),
(3, 'Thursday', '14:00:00', '17:00:00', 30, 2),
(3, 'Friday', '10:00:00', '12:00:00', 30, 2),
(3, 'Friday', '14:00:00', '17:00:00', 30, 2);


