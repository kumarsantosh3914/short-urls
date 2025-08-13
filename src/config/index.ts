// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    MONGODB_URI: string;
    REDIS_URI: string;
    REDIS_COUNTER_KEY: string;
}

function loadEnv() {
    dotenv.config();
    console.log('Environment variables loaded from .env file');
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_URI: String(process.env.MONGODB_URI) || 'mongodb://localhost:27017/short-urls',
    REDIS_URI: String(process.env.REDIS_URL) || 'redis://localhost:6379',
    REDIS_COUNTER_KEY: String(process.env.REDIS_COUNTER_KEY) || 'url_shortener_counter',
}
