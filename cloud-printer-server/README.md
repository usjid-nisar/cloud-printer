# Cloud Printer API

A Node.js backend service for managing print orders, partner integrations, and white-label APIs.

## Features

- RESTful API with Express and TypeScript
- PostgreSQL database with Prisma ORM
- Partner authentication with API keys
- Order management system
- Integration with e-commerce platforms (Shopify, WooCommerce)
- Swagger API documentation
- Structured logging with Winston
- Docker support
- Health monitoring
- Audit logging for security events
- DNS validation for custom domains
- White-label branding customization
- Rate limiting and CORS protection

## Prerequisites

- Node.js 20.x
- PostgreSQL 16.x
- Docker and Docker Compose (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cloud_printer

# Security
JWT_SECRET=your-super-secret-key-change-in-production
API_KEY_SALT=your-api-key-salt-change-in-production

# Monitoring
SENTRY_DSN=your-sentry-dsn

# External Services
SHOPIFY_APP_ID=your-shopify-app-id
SHOPIFY_APP_SECRET=your-shopify-app-secret
WOOCOMMERCE_KEY=your-woocommerce-key
WOOCOMMERCE_SECRET=your-woocommerce-secret
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

## Development

Start the development server:
```bash
npm run dev
```

Build the TypeScript code:
```bash
npm run build
```

## Docker Setup

1. Build and start services:
   ```bash
   docker-compose up --build
   ```

2. Run migrations in Docker:
   ```bash
   docker-compose exec api npx prisma migrate dev
   ```

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Orders

- `POST /v1/orders` - Create a new order
- `GET /v1/orders` - List orders with pagination
- `GET /v1/orders/:orderId` - Get order details
- `PATCH /v1/orders/:orderId` - Update order status

### Onboarding

- `POST /v1/onboarding/create` - Create new partner account
- `POST /v1/onboarding/validate-domain/:domain` - Validate domain DNS setup
- `PUT /v1/onboarding/:partnerId/branding` - Update partner branding settings
- `POST /v1/onboarding/:partnerId/rotate-key` - Rotate partner API key
- `POST /v1/onboarding/validate-key` - Validate API key
- `GET /v1/onboarding/:partnerId/status` - Get partner onboarding status

### Webhooks

- `POST /v1/webhooks/shopify` - Shopify webhook endpoint
  - Handles order creation and cancellation
  - Validates webhook signatures
- `POST /v1/webhooks/woocommerce` - WooCommerce webhook endpoint
  - Handles order creation and cancellation
  - Validates webhook signatures

## Testing

Run the test suite:
```bash
npm test
```

## Monitoring

- Health check endpoint: `GET /health`
- Logs are stored in the `logs` directory:
  - `combined.log` - All logs
  - `error.log` - Error logs only
  - `exceptions.log` - Uncaught exceptions
  - `rejections.log` - Unhandled promise rejections
- Error tracking with Sentry (when configured)

## Security

- API authentication using API keys
- Rate limiting on all endpoints
- Secure headers with Helmet
- Input validation with Zod
- CORS protection
- Audit logging for security events
- Webhook signature validation
- API key rotation support

## License

MIT 