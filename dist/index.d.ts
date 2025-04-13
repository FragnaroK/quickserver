import { ApiHandlersRecord, ApiOptions } from "./classes/abstract/express/api.js";
import Class from "./classes/index.js";
import express, { Router as QuickServerRouter } from "express";
import { MiddlewareFunction } from "./types/express/middleware.js";
import AppError from "./classes/error.js";
import Utils from "./lib/index.js";
import Database from "./db/index.js";
export type QuickServerRoutes = Record<string, QuickServerRouter>;
export type QuickServerApp = express.Express;
export type QuickServerEvents = "server_started" | "server_stopped" | "server_error";
export type QuickServerRequest = express.Request;
export type QuickServerResponse = express.Response;
export type QuickServerNext = express.NextFunction;
export type QuickServerConfig = {
    routes: QuickServerRoutes;
    middlewares?: MiddlewareFunction[];
    handlers?: ApiHandlersRecord;
    options?: ApiOptions;
    app: QuickServerApp;
};
export * from "./classes/index.js";
export * from "./lib/index.js";
export * from "./db/index.js";
export * from "./types/index.js";
export { Class, Utils, Database, QuickServerRouter };
export default class QuickServer extends Class.Base.Api {
    readonly state: {
        started: boolean;
        stopped: boolean;
        error: boolean;
    };
    constructor(config: QuickServerConfig);
    onStart(): void;
    onStop(): void;
    onError(error: AppError): void;
    on(event: QuickServerEvents, callback: (...args: any[]) => void): void;
    emit(event: QuickServerEvents, ...args: any[]): void;
}
