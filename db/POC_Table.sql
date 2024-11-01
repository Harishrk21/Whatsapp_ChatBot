
CREATE TABLE POC (
    POC_ID INT PRIMARY KEY AUTO_INCREMENT,
    Client_ID INT,
    Department_ID INT,
    POC_Name VARCHAR(100),
    Specialization VARCHAR(100),
    Contact_Number VARCHAR(20),
    Email VARCHAR(100),
    FOREIGN KEY (Client_ID) REFERENCES Client(Client_ID) ON DELETE CASCADE,
    FOREIGN KEY (Department_ID) REFERENCES List(Item_ID) ON DELETE SET NULL
);

-- Insert Doctors into POC Table
INSERT INTO POC (Client_ID, Department_ID, POC_Name, Specialization, Contact_Number, Email)
VALUES
(1, 1, 'Dr. Harry Smith', 'Cardiology', '+917299817996', 'harishradhakrishnan2001@gmail.com'),
(1, 2, 'Dr. Preet Jones', 'Orthopedics', '+919094995418', 'preethivijay0706@gmail.com'),
(1, 3, 'Dr. Praggy Davis', 'Pediatrics', '+919003060876', 'harishrk2101@gmail.com');
