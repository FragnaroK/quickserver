/// <reference types="node" resolution-mode="require"/>
import { Express, Router, RequestHandler } from "express";
import * as http from "http";
import cors from "cors";
import { MiddlewareFunction } from "../../../types/express/middleware.js";
import AppError from "../../error.js";
import { Log } from "../../../lib/logger.js";
export type ApiHandler = "notFound" | "error";
export type ApiDefaultEndpoints = "health" | "ping";
export type ApiHandlersRecord = Partial<Record<ApiHandler, MiddlewareFunction>>;
export type ApiEnvironment = {
    DEBUG: boolean;
    PORT: number;
} & {
    [key: string]: any;
};
export type ApiConfig = {
    basePath?: string;
    corsOptions?: cors.CorsOptions;
    bodyParserLimit?: string;
    trustProxy?: boolean;
    trustProxyValue?: any;
    autoStart?: boolean;
} & ApiEnvironment;
export default abstract class Api {
    protected readonly app: Express;
    protected readonly routes: Record<string, Router>;
    protected readonly middlewares: RequestHandler[];
    protected readonly handlers: ApiHandlersRecord;
    protected readonly config?: ApiConfig | undefined;
    private readonly registeredHandlers;
    protected readonly logger: Log;
    protected server: http.Server | undefined;
    protected basePath: string;
    protected env: ApiEnvironment;
    constructor(app: Express, routes: Record<string, Router>, middlewares?: RequestHandler[], handlers?: ApiHandlersRecord, config?: ApiConfig | undefined, logger?: Log);
    private applyDefaultMiddlewares;
    private setMiddlewares;
    private setRoutes;
    private setHandlers;
    private applyDefaultEndpoints;
    private applyDefaultHandlers;
    private setupGracefulShutdown;
    private init;
    start(): Promise<void>;
    shutdown(): Promise<void>;
    abstract onStart(): void;
    abstract onStop(): void;
    abstract onError(error: AppError): void;
}
