import { createClient } from "redis";
import { serverConfig } from ".";
import logger from "./logger.config";

export const redisClient = createClient({
    url: serverConfig.REDIS_URI,
})

redisClient.on('erro', (err) => {
    logger.error('Redis Client Error', err);
})

redisClient.on('connect', () => {
    logger.info('Redis client connected successfully');
});

export async function initRedis() {
    try {
        await redisClient.connect();
        logger.info('Redis client initialized');
    } catch (error) {
        logger.error('Error initializing Redis client', error);
        throw error;
    }
}