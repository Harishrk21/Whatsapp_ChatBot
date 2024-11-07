
CREATE TABLE Appointments (
    Client_ID INT,
    Appointment_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    POC_ID INT,
    Appointment_Date DATE,
    Appointment_Time TIME,
    User_Location VARCHAR(255),
    User_Name VARCHAR(100),
    Appointment_Type ENUM('Tele Consultation', 'Direct Consultation', 'Emergency') DEFAULT 'Direct Consultation',  -- New column to store type of appointment
    Status ENUM('Confirmed', 'Rescheduled', 'Cancelled', 'Completed', 'Not_Availed') DEFAULT 'Confirmed',
    Is_Active BOOLEAN DEFAULT TRUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Client_ID) REFERENCES Client(Client_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (POC_ID) REFERENCES POC(POC_ID) ON DELETE CASCADE
);

