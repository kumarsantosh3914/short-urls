import express from 'express';
import { Express } from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import logger from './config/logger.config';
import { connectDB } from './config/db';
import { initRedis } from './config/redis';

const app: Express = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Regestering all the routers and their corresponding routes with out app server object.
app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

app.use(appErrorHandler);
// Middleware to handle errors
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    await initRedis();
    logger.info('Redis client initialized successfully');
    await connectDB();
    logger.info('Connected to the database successfully');
})