# URL Shortener Backend

A high-performance URL shortening service built with Express.js, TypeScript, tRPC, MongoDB, and Redis. This backend provides a robust API for creating short URLs and redirecting users to original URLs with click tracking.

## 🚀 Features

- **URL Shortening**: Convert long URLs to short, manageable URLs
- **Click Tracking**: Monitor how many times each short URL is accessed
- **Caching**: Redis-based caching for improved performance
- **Type Safety**: Full TypeScript support with tRPC for type-safe APIs
- **Base62 Encoding**: Efficient short URL generation using Base62 encoding
- **Error Handling**: Comprehensive error handling with custom error classes
- **Logging**: Structured logging with Winston
- **Correlation IDs**: Request tracking with correlation IDs
- **API Versioning**: Support for multiple API versions (v1, v2)

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **API Layer**: tRPC for type-safe APIs
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Logging**: Winston with daily rotation
- **Validation**: Zod schema validation
- **Error Handling**: Custom error classes

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Redis (v6 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd short-urls
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
BASE_URL=http://localhost:3001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/short-urls

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_COUNTER_KEY=url_shortener_counter
```

### 4. Start Services

Make sure MongoDB and Redis are running on your system:

```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start Redis (if using Docker)
docker run -d -p 6379:6379 --name redis redis:latest
```

### 5. Run the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## 📚 API Documentation

### tRPC Endpoints

The application uses tRPC for type-safe API communication. All tRPC endpoints are available under the `/trpc` path.

#### 1. Create Short URL

**Endpoint**: `POST /trpc/url.create`

**Request Body**:
```json
{
    "originalUrl": "https://example.com/very-long-url-that-needs-to-be-shortened"
}
```

**Response**:
```json
{
    "id": "507f1f77bcf86cd799439011",
    "shortUrl": "1a2b3c",
    "originalUrl": "https://example.com/very-long-url-that-needs-to-be-shortened",
    "fullUrl": "http://localhost:3001/1a2b3c",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**cURL Example**:
```bash
curl --location 'http://localhost:3001/trpc/url.create' \
--header 'Content-Type: application/json' \
--data '{
    "originalUrl": "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
}'
```

#### 2. Get Original URL

**Endpoint**: `GET /trpc/url.getOriginalUrl`

**Query Parameters**:
```json
{
    "shortUrl": "1a2b3c"
}
```

**Response**:
```json
{
    "originalUrl": "https://example.com/very-long-url-that-needs-to-be-shortened",
    "shortUrl": "1a2b3c"
}
```

**cURL Example**:
```bash
curl --location --globoff 'http://localhost:3001/trpc/url.getOriginalUrl?input={%22shortUrl%22%3A%20%221%22}' \
--header 'Content-Type: application/json' \
--data ''
```

### Direct Redirect Endpoint

**Endpoint**: `GET /:shortUrl`

This endpoint directly redirects users to the original URL when they visit a short URL.

**Example**: `http://localhost:3001/1a2b3c` will redirect to the original URL.

### REST API Endpoints (v1)

#### Health Check

**Endpoint**: `GET /api/v1/ping`

**Response**:
```json
{
    "message": "pong",
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🏗️ Project Architecture

```
src/
├── config/                 # Configuration files
│   ├── db.ts              # MongoDB connection
│   ├── index.ts           # Server configuration
│   ├── logger.config.ts   # Winston logger setup
│   └── redis.ts           # Redis connection
├── controllers/           # tRPC controllers
│   ├── ping.controller.ts # Health check controller
│   └── url.controller.ts  # URL operations controller
├── dto/                   # Data Transfer Objects
│   └── url.dto.ts         # URL-related DTOs
├── middlewares/           # Express middlewares
│   ├── correlation.middleware.ts # Correlation ID middleware
│   └── error.middleware.ts       # Error handling middleware
├── models/                # Database models
│   └── Url.ts             # URL model schema
├── repositories/          # Data access layer
│   ├── cache.repository.ts # Redis operations
│   └── url.repository.ts   # MongoDB operations
├── routers/               # Express routers
│   ├── v1/                # API version 1
│   └── v2/                # API version 2
├── services/              # Business logic layer
│   └── url.service.ts     # URL service operations
├── trpc/                  # tRPC setup
│   ├── context.ts         # tRPC context
│   ├── index.ts           # Main tRPC router
│   └── url.ts             # URL tRPC router
├── utils/                 # Utility functions
│   ├── base62.ts          # Base62 encoding utilities
│   ├── errors/            # Custom error classes
│   └── helpers/           # Helper functions
├── validators/            # Input validation
│   ├── index.ts           # Validator exports
│   └── ping.validators.ts # Ping endpoint validators
└── server.ts              # Main server file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Server port | `3000` |
| `BASE_URL` | Base URL for short URLs | `http://localhost:3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/short-urls` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `REDIS_COUNTER_KEY` | Redis key for URL counter | `url_shortener_counter` |

### Database Schema

#### URL Collection

```typescript
interface IUrl {
    originalUrl: string;    // The original long URL
    shortUrl: string;       // The generated short URL
    clicks: number;         // Number of times accessed
    createdAt: Date;        // Creation timestamp
    updatedAt: Date;        // Last update timestamp
}
```

## 🚀 Performance Features

### Caching Strategy

- **Redis Caching**: Short URL to original URL mappings are cached in Redis
- **Counter Management**: URL generation counter is stored in Redis for consistency
- **Cache-First Lookup**: URLs are first checked in cache before database lookup

### Base62 Encoding

- **Efficient Encoding**: Uses Base62 (0-9, a-z, A-Z) for short URL generation
- **Sequential Generation**: URLs are generated sequentially using an auto-incrementing counter
- **Collision-Free**: Ensures unique short URLs through database constraints

## 📊 Monitoring & Logging

### Logging Configuration

- **Winston Logger**: Structured logging with multiple transports
- **Daily Rotation**: Log files are rotated daily
- **MongoDB Logging**: Logs are also stored in MongoDB for analysis
- **Correlation IDs**: Each request gets a unique correlation ID for tracking

### Log Levels

- `error`: Application errors
- `warn`: Warning messages
- `info`: General information
- `debug`: Debug information

## 🛡️ Error Handling

### Custom Error Classes

- `AppError`: Base error class
- `NotFoundError`: Resource not found errors
- `InternalServerError`: Server-side errors
- `ValidationError`: Input validation errors

### Error Response Format

```json
{
    "success": false,
    "message": "Error description",
    "error": "Error type",
    "correlationId": "unique-request-id"
}
```

## 🧪 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Build TypeScript to JavaScript
npm run build

# Run TypeScript compiler in watch mode
npm run watch
```

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access operations
- **Models**: Define database schemas
- **Middlewares**: Handle cross-cutting concerns
- **Utils**: Reusable utility functions

## 🔒 Security Considerations

- **Input Validation**: All inputs are validated using Zod schemas
- **Error Sanitization**: Sensitive information is not exposed in error messages
- **Rate Limiting**: Consider implementing rate limiting for production
- **CORS**: Configure CORS settings for production deployment

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**: Set all required environment variables
2. **Database**: Ensure MongoDB and Redis are properly configured
3. **Logging**: Configure appropriate log levels for production
4. **Monitoring**: Set up application monitoring and alerting
5. **SSL/TLS**: Configure HTTPS for secure communication
6. **Rate Limiting**: Implement rate limiting to prevent abuse

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
