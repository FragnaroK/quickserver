import { ApiConfig, ApiHandlersRecord } from "./classes/abstract/express/api.js";
import Class from "./classes/index.js";
import express, { Router } from "express";
import { MiddlewareFunction } from "./types/express/middleware.js";
import AppError from "./classes/error.js";
type QuickServeEvents = "server_started" | "server_stopped" | "server_error";
export default class QuickServe extends Class.Base.Api {
    readonly state: {
        started: boolean;
        stopped: boolean;
        error: boolean;
    };
    constructor(routes: Record<string, Router>, middlewares?: MiddlewareFunction[], handlers?: ApiHandlersRecord, config?: ApiConfig, app?: express.Express);
    onStart(): void;
    onStop(): void;
    onError(error: AppError): void;
    on(event: QuickServeEvents, callback: (...args: any[]) => void): void;
    emit(event: QuickServeEvents, ...args: any[]): void;
}
export {};
