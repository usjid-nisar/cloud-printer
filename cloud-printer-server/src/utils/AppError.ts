export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  details?: any;
  originalError?: Error;

  constructor(
    message: string,
    statusCode: number,
    details?: any,
    originalError?: Error
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;
    this.originalError = originalError;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: any) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message: string = 'Unauthorized', details?: any) {
    return new AppError(message, 401, details);
  }

  static forbidden(message: string = 'Forbidden', details?: any) {
    return new AppError(message, 403, details);
  }

  static notFound(message: string = 'Not found', details?: any) {
    return new AppError(message, 404, details);
  }

  static conflict(message: string, details?: any) {
    return new AppError(message, 409, details);
  }

  static validationError(message: string, details?: any) {
    return new AppError(message, 422, details);
  }

  static internalError(message: string = 'Internal server error', originalError?: Error) {
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