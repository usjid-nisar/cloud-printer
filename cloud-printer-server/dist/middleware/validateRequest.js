"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = exports.validateRequest = void 0;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            // Parse request data against schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                headers: req.headers,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                logger_1.logger.warn('Request validation failed:', {
                    path: req.path,
                    errors: error.errors,
                });
                // Format validation errors
                const validationErrors = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: validationErrors,
                });
            }
            else {
                logger_1.logger.error('Unexpected validation error:', error);
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
// Helper function to validate request body only
const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                logger_1.logger.warn('Request body validation failed:', {
                    path: req.path,
                    errors: error.errors,
                });
                res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            else {
                logger_1.logger.error('Unexpected validation error:', error);
                next(error);
            }
        }
    };
};
exports.validateBody = validateBody;
// Helper function to validate query parameters only
const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                logger_1.logger.warn('Query parameter validation failed:', {
                    path: req.path,
                    errors: error.errors,
                });
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid query parameters',
                    errors: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            else {
                logger_1.logger.error('Unexpected validation error:', error);
                next(error);
            }
        }
    };
};
exports.validateQuery = validateQuery;
// Helper function to validate URL parameters only
const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                logger_1.logger.warn('URL parameter validation failed:', {
                    path: req.path,
                    errors: error.errors,
                });
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid URL parameters',
                    errors: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            else {
                logger_1.logger.error('Unexpected validation error:', error);
                next(error);
            }
        }
    };
};
exports.validateParams = validateParams;
