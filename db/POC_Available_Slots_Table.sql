CREATE TABLE POC_Available_Slots (
    Slot_ID INT PRIMARY KEY AUTO_INCREMENT,
    POC_ID INT,
    Schedule_Date DATE,
    Start_Time TIME,
    End_Time TIME,
    appointments_per_slot INT,
    slot_duration INT,
    FOREIGN KEY (POC_ID) REFERENCES POC(POC_ID) ON DELETE CASCADE
);

SHOW CREATE TABLE POC_Available_Slots;

ALTER TABLE POC_Available_Slots DROP FOREIGN KEY poc_available_slots_ibfk_2;

