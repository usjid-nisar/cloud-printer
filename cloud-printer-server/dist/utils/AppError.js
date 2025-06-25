"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, details, originalError) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;
        this.originalError = originalError;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, details) {
        return new AppError(message, 400, details);
    }
    static unauthorized(message = 'Unauthorized', details) {
        return new AppError(message, 401, details);
    }
    static forbidden(message = 'Forbidden', details) {
        return new AppError(message, 403, details);
    }
    static notFound(message = 'Not found', details) {
        return new AppError(message, 404, details);
    }
    static conflict(message, details) {
        return new AppError(message, 409, details);
    }
    static validationError(message, details) {
        return new AppError(message, 422, details);
    }
    static internalError(message = 'Internal server error', originalError) {
        return new AppError(message, 500, undefined, originalError);
    }
    toJSON() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            ...(this.details && { details: this.details }),
            ...(process.env.NODE_ENV === 'development' && {
                stack: this.stack,
                originalError: this.originalError,
            }),
        };
    }
}
exports.AppError = AppError;
