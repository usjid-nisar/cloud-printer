"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
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
winston_1.default.addColors(colors);
// Define log format
const format = winston_1.default.format.combine(
// Add timestamp
winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), 
// Add trace ID if available
winston_1.default.format((info) => {
    info.traceId = process.env.TRACE_ID;
    return info;
})(), 
// Add colors for console
winston_1.default.format.colorize({ all: true }), 
// Define the format of the message showing the timestamp, the level and the message
winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}${info.traceId ? ` [TraceID: ${info.traceId}]` : ''}${info.stack ? `\n${info.stack}` :
    info.details ? `\n${JSON.stringify(info.details, null, 2)}` : ''}`));
// Define which transports the logger must use to print out messages
const transports = [
    // Console transport
    new winston_1.default.transports.Console(),
    // Error log file transport
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
    }),
    // Combined log file transport
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'combined.log'),
    }),
];
// Create the logger instance
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    format,
    transports,
    // Handle uncaught exceptions and rejections
    exceptionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join('logs', 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join('logs', 'rejections.log'),
        }),
    ],
});
exports.logger = logger;
// Create a stream object with a write function that will be used by Morgan
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
