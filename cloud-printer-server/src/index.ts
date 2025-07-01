import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { PrismaClient } from '@prisma/client';
import { onboardingRoutes } from './routes/onboardingRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { webhookRoutes } from './routes/webhookRoutes';
import {
  errorHandler,
  notFoundHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
} from './middleware/errorHandler';
import { logger, stream } from './utils/logger';
import authRoutes from './routes/authRoutes';

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS with specific configuration
app.use(cors({
  origin: [
    'http://localhost:3000',  // Admin frontend
    'http://localhost:3002',  // Client frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream }));
}

// Rate limiting
const limiter = rateLimit({
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
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
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

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Handle 404 routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', uncaughtExceptionHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', unhandledRejectionHandler);

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Connected to database successfully');

    // Start listening
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async () => {
  try {
    logger.info('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
startServer(); 