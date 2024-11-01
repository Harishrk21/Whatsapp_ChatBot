Create database chatbot;

use chatbot;


CREATE TABLE Client (
    Client_ID INT PRIMARY KEY AUTO_INCREMENT,
    Client_Name VARCHAR(100),
    Location VARCHAR(255),
    Contact_Number VARCHAR(20),
    Email VARCHAR(100)
);

INSERT INTO Client (Client_Name, Location, Contact_Number, Email)
VALUES ('MIOT Hospital', 'Anna Nagar, Chennai', '+917305195418', 'contact@cityhospital.com');
