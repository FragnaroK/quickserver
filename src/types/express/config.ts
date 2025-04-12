import cors from 'cors';

export interface IServerConfigExtras {
    logs?: boolean;
    serverless?: boolean;
    limiter: ILimiterConfig;
}

export interface ILimiterConfig {
    waitTime: number;
    maxMessages: number;
    maxUsernameLength: number;
    maxUserMessages: number;
    maxMessageLength: number;
}

export interface IServerConfig {
    port: number | string;
    cors: cors.CorsOptions;
    options: IServerConfigExtras;
}
