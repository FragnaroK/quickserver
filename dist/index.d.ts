import { ApiConfig, ApiHandlersRecord } from "./classes/abstract/express/api.js";
import Class from "./classes/index.js";
import express, { Router } from "express";
import { MiddlewareFunction } from "./types/express/middleware.js";
import AppError from "./classes/error.js";
import Utils from './lib/index.js';
import Database from './db/index.js';
export type QuickServerEvents = "server_started" | "server_stopped" | "server_error";
export * from './classes/index.js';
export * from './lib/index.js';
export * from './db/index.js';
export * from './types/index.js';
export { Class, Utils, Database };
export default class QuickServer extends Class.Base.Api {
    readonly state: {
        started: boolean;
        stopped: boolean;
        error: boolean;
    };
    constructor(routes: Record<string, Router>, middlewares?: MiddlewareFunction[], handlers?: ApiHandlersRecord, config?: ApiConfig, app?: express.Express);
    onStart(): void;
    onStop(): void;
    onError(error: AppError): void;
    on(event: QuickServerEvents, callback: (...args: any[]) => void): void;
    emit(event: QuickServerEvents, ...args: any[]): void;
}
