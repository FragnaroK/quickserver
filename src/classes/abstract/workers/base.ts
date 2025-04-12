import getEnv from '@/lib/getEnv.js';

export default abstract class WorkerBase {
    protected static get isTest(): boolean {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'test';
    }

    protected static get isProd(): boolean {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'production';
    }

    protected static get isDev(): boolean {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'development';
    }

    protected static get isDebug(): boolean {
        return getEnv<boolean>('DEBUG', process.env.DEBUG, { fallback: false });
    }

    protected static get isLogging(): boolean {
        return getEnv<boolean>('LOGGING', process.env.LOGGING, { fallback: false });
    }
    protected get isTest(): boolean {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'test';
    }

    protected get isProd(): boolean {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'production';
    }

    protected get isDev(): boolean {
        return getEnv('NODE_ENV', process.env.NODE_ENV) === 'development';
    }

    protected get isDebug(): boolean {
        return getEnv<boolean>('DEBUG', process.env.DEBUG, { fallback: false });
    }

    protected get isLogging(): boolean {
        return getEnv<boolean>('LOGGING', process.env.LOGGING, { fallback: false });
    }
}
