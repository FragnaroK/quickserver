import getEnv from '@/lib/getEnv.js';
export default class WorkerBase {
    static get isTest() {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'test';
    }
    static get isProd() {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'production';
    }
    static get isDev() {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'development';
    }
    static get isDebug() {
        return getEnv('DEBUG', process.env.DEBUG, { fallback: false });
    }
    static get isLogging() {
        return getEnv('LOGGING', process.env.LOGGING, { fallback: false });
    }
    get isTest() {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'test';
    }
    get isProd() {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'production';
    }
    get isDev() {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'development';
    }
    get isDebug() {
        return getEnv('DEBUG', process.env.DEBUG, { fallback: false });
    }
    get isLogging() {
        return getEnv('LOGGING', process.env.LOGGING, { fallback: false });
    }
}
