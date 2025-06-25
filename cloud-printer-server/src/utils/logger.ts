import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to Winston
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  // Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Add trace ID if available
  winston.format((info) => {
    info.traceId = process.env.TRACE_ID;
    return info;
  })(),
  // Add colors for console
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${
      info.traceId ? ` [TraceID: ${info.traceId}]` : ''
    }${
      info.stack ? `\n${info.stack}` : 
      info.details ? `\n${JSON.stringify(info.details, null, 2)}` : ''
    }`
  )
);

// Define which transports the logger must use to print out messages
const transports = [
  // Console transport
  new winston.transports.Console(),
  // Error log file transport
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  // Combined log file transport
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log'),
    }),
  ],
});

// Create a stream object with a write function that will be used by Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export the logger
export { logger }; 