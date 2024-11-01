const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

let connection;

function connectDB() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database.');
    });
}

function getConnection() {
    return connection;
}

module.exports = { connectDB, getConnection };
