use chatbot;
CREATE TABLE Menu (
    Menu_ID INT PRIMARY KEY AUTO_INCREMENT,
    Client_ID INT,
    Language VARCHAR(10),
    Menu_Name VARCHAR(100),
    Display_Order INT,
    Parent_Menu_ID INT DEFAULT 0,
    Action VARCHAR(255),
    FOREIGN KEY (Client_ID) REFERENCES Client(Client_ID) ON DELETE CASCADE
);

INSERT INTO Menu (Menu_ID, Client_ID, Language, Menu_Name, Display_Order, Parent_Menu_ID, Action) VALUES
(1, 1, 'ENG', 'Book Appointment', 1, 0, 'SHOW_APPOINTMENT_OPTIONS'),
(2, 1, 'ENG', 'Reschedule', 2, 0, 'FETCH_RESCHEDULE_OPTIONS'),
(3, 1, 'ENG', 'Cancel', 3, 0, 'FETCH_CANCEL_OPTIONS'),
(4, 1, 'ENG', 'Emergency', 1, 1, 'FETCH_EMERGENCY_REASONS'),
(5, 1, 'ENG', 'Tele Consultation', 2, 1, 'FETCH_DEPARTMENTS_TELE'),
(6, 1, 'ENG', 'Direct Consultation', 3, 1, 'FETCH_DEPARTMENTS_DIRECT'),
(7, 1, 'ENG', 'Share Your Location', 1, 4, 'ASK_LIVE_LOCATION'),
(8, 1, 'ENG', 'Enter Name Emergency', 1, 7, 'ASK_NAME_EMERGENCY'),
(9, 1, 'ENG', 'Confirm Emergency Details', 1, 8, 'CONFIRM_EMERGENCY'),
(10, 1, 'ENG', 'Finalize Emergency', 1, 9, 'FINALIZE_EMERGENCY'),
(11, 1, 'ENG', 'Select Doctor Direct', 1, 6, 'FETCH_DOCTORS_DIRECT'),
(12, 1, 'ENG', 'Select Date Direct', 1, 11, 'FETCH_AVAILABLE_DATES_DIRECT'),
(13, 1, 'ENG', 'Select Time Direct', 1, 12, 'FETCH_AVAILABLE_TIMES_DIRECT'),
(14, 1, 'ENG', 'Enter Name Direct', 1, 13, 'ASK_NAME_DIRECT'),
(15, 1, 'ENG', 'Enter Email Direct', 2, 14, 'ASK_EMAIL_DIRECT'),
(16, 1, 'ENG', 'Enter Mobile Direct', 3, 15, 'ASK_PHONE_NUMBER_DIRECT'),
(17, 1, 'ENG', 'Confirm Direct Appointment', 1, 16, 'CONFIRM_DIRECT_APPOINTMENT'),
(18, 1, 'ENG', 'Finalize Direct Appointment', 1, 17, 'FINALIZE_DIRECT_APPOINTMENT'),
(19, 1, 'ENG', 'Select Doctor Tele', 1, 5, 'FETCH_DOCTORS_TELE'),
(20, 1, 'ENG', 'Select Date Tele', 1, 19, 'FETCH_AVAILABLE_DATES_TELE'),
(21, 1, 'ENG', 'Select Time Tele', 1, 20, 'FETCH_AVAILABLE_TIMES_TELE'),
(22, 1, 'ENG', 'Enter Name Tele', 1, 21, 'ASK_NAME_TELE'),
(23, 1, 'ENG', 'Enter Email Tele', 2, 22, 'ASK_EMAIL_TELE'),
(24, 1, 'ENG', 'Enter Mobile Tele', 3, 23, 'ASK_PHONE_NUMBER_TELE'),
(25, 1, 'ENG', 'Enter Location Tele', 1, 24, 'ASK_LOCATION_TELE'),
(26, 1, 'ENG', 'Confirm Tele Appointment', 1, 25, 'CONFIRM_TELE_APPOINTMENT'),
(27, 1, 'ENG', 'Finalize Tele Appointment', 1, 26, 'FINALIZE_TELE_APPOINTMENT'),
(28, 1, 'ENG', 'Enter Appointment ID for Reschedule', 1, 2, 'RESCHEDULE_APPOINTMENT'),
(29, 1, 'ENG', 'Enter Appointment ID for Cancel', 1, 3, 'CANCEL_APPOINTMENT');

ALTER TABLE Menu ADD COLUMN Message VARCHAR(100);


UPDATE Menu SET Message = 'Select an appointment option' WHERE Menu_ID = 1;
UPDATE Menu SET Message = 'Enter Your Appointment ID' WHERE Menu_ID = 2;
UPDATE Menu SET Message = 'Enter Your Appointment ID' WHERE Menu_ID = 3;
UPDATE Menu SET Message = 'Select Emergency reason' WHERE Menu_ID = 4;
UPDATE Menu SET Message = 'Select a department' WHERE Menu_ID = 5;
UPDATE Menu SET Message = 'Select a department' WHERE Menu_ID = 6;
UPDATE Menu SET Message = 'Share Your Location' WHERE Menu_ID = 7;
UPDATE Menu SET Message = 'Enter Your name' WHERE Menu_ID = 8;
UPDATE Menu SET Message = 'Please Confirm Your details' WHERE Menu_ID = 9;
UPDATE Menu SET Message = 'Waiting for your arrival' WHERE Menu_ID = 10;
UPDATE Menu SET Message = 'Select a doctor' WHERE Menu_ID = 11;
UPDATE Menu SET Message = 'Select a date' WHERE Menu_ID = 12;
UPDATE Menu SET Message = 'Select a time' WHERE Menu_ID = 13;
UPDATE Menu SET Message = 'Enter Your Name' WHERE Menu_ID = 14;
UPDATE Menu SET Message = 'Enter Your Email' WHERE Menu_ID = 15;
UPDATE Menu SET Message = 'Enter Your Phone Number' WHERE Menu_ID = 16;
UPDATE Menu SET Message = 'Please Confirm Your details' WHERE Menu_ID = 17;
UPDATE Menu SET Message = 'Waiting for your arrival' WHERE Menu_ID = 18;
UPDATE Menu SET Message = 'Select a doctor' WHERE Menu_ID = 19;
UPDATE Menu SET Message = 'Select a date' WHERE Menu_ID = 20;
UPDATE Menu SET Message = 'Select a time' WHERE Menu_ID = 21;
UPDATE Menu SET Message = 'Enter Your Name' WHERE Menu_ID = 22;
UPDATE Menu SET Message = 'Enter Your E-Mail' WHERE Menu_ID = 23;
UPDATE Menu SET Message = 'Enter Your Phone Number' WHERE Menu_ID = 24;
UPDATE Menu SET Message = 'Enter Your Location' WHERE Menu_ID = 25;
UPDATE Menu SET Message = 'Please Confirm Your details' WHERE Menu_ID = 26;
UPDATE Menu SET Message = 'Your gmeet link is given below' WHERE Menu_ID = 27;
UPDATE Menu SET Message = 'Your appointment has been rescheduled' WHERE Menu_ID = 28;
UPDATE Menu SET Message = 'Your appointment has been cancelled' WHERE Menu_ID = 29;


USE chatbot;