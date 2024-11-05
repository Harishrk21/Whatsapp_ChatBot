// logger.js
const { createLogger, format, transports } = require('winston');

// Define the logging format
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
    new transports.File({ filename: 'combined.log' }) // Log all messages to a file
  ],
});

// Export the logger
module.exports = logger;
