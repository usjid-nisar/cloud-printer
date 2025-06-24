"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const client_1 = require("@prisma/client");
const onboardingRoutes_1 = require("./routes/onboardingRoutes");
const orderRoutes_1 = require("./routes/orderRoutes");
const webhookRoutes_1 = require("./routes/webhookRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
// Initialize Prisma client
const prisma = new client_1.PrismaClient();
// Create Express app
const app = (0, express_1.default)();
// Set security HTTP headers
app.use((0, helmet_1.default)());
// Enable CORS
app.use((0, cors_1.default)());
// Parse JSON bodies
app.use(express_1.default.json({ limit: '10mb' }));
// Parse URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev', { stream: logger_1.stream }));
}
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);
// Swagger documentation setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cloud Printer API',
            version: '1.0.0',
            description: 'API documentation for Cloud Printer service',
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// API routes
app.use('/v1/onboarding', onboardingRoutes_1.onboardingRoutes);
app.use('/v1/orders', orderRoutes_1.orderRoutes);
app.use('/v1/webhooks', webhookRoutes_1.webhookRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});
// Handle 404 routes
app.use(errorHandler_1.notFoundHandler);
// Global error handler
app.use(errorHandler_1.errorHandler);
// Handle uncaught exceptions
process.on('uncaughtException', errorHandler_1.uncaughtExceptionHandler);
// Handle unhandled promise rejections
process.on('unhandledRejection', errorHandler_1.unhandledRejectionHandler);
// Start server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        // Connect to database
        await prisma.$connect();
        logger_1.logger.info('Connected to database successfully');
        // Start listening
        app.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`);
            logger_1.logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
const gracefulShutdown = async () => {
    try {
        logger_1.logger.info('Shutting down gracefully...');
        await prisma.$disconnect();
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Start the server
startServer();
