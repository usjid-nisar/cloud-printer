export declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    details?: any;
    originalError?: Error;
    constructor(message: string, statusCode: number, details?: any, originalError?: Error);
    static badRequest(message: string, details?: any): AppError;
    static unauthorized(message?: string, details?: any): AppError;
    static forbidden(message?: string, details?: any): AppError;
    static notFound(message?: string, details?: any): AppError;
    static conflict(message: string, details?: any): AppError;
    static validationError(message: string, details?: any): AppError;
    static internalError(message?: string, originalError?: Error): AppError;
    toJSON(): any;
}
