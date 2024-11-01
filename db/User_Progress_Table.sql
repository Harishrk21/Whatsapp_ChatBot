
CREATE TABLE User_Progress (
    User_ID INT,
    Session_ID VARCHAR(50),
    Tag VARCHAR(255),
    Current_Menu_ID INT,
    Input_Data TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (User_ID, Session_ID),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

ALTER TABLE User_Progress DROP FOREIGN KEY user_progress_ibfk_1;
ALTER TABLE appointments DROP FOREIGN KEY appointments_ibfk_2;

-- Remove User_ID from User_Progress table
ALTER TABLE User_Progress DROP COLUMN User_ID;


-- Add Temp_User_ID as an auto-incrementing primary key
ALTER TABLE User_Progress ADD Temp_User_ID INT AUTO_INCREMENT PRIMARY KEY FIRST;


ALTER TABLE Users MODIFY User_ID BIGINT;
ALTER TABLE User_Progress MODIFY User_ID BIGINT;
ALTER TABLE appointments MODIFY User_ID BIGINT;
drop table User_Progress;

ALTER TABLE User_Progress ADD CONSTRAINT user_progress_ibfk_1 FOREIGN KEY (User_ID) REFERENCES Users(User_ID);
ALTER TABLE appointments ADD CONSTRAINT appointments_ibfk_2 FOREIGN KEY (User_ID) REFERENCES Users(User_ID);




