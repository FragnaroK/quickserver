import { ApiHandlersRecord, ApiOptions } from "./classes/abstract/express/api.js";
import Class from "./classes/index.js";
import express, { Router as QuickServerRouter } from "express";
import { MiddlewareFunction } from "./types/express/middleware.js";
import AppError from "./classes/error.js";
import responseHelpers from "./middlewares/response.js";
import Utils from "./lib/index.js";
import Database from "./db/index.js";

export type QuickServerRoutes = Record<string, QuickServerRouter>;
export type QuickServerApp = express.Express;
export type QuickServerEvents = "server_started" | "server_stopped" | "server_error" | "server_initialized";
export type QuickServerRequest = express.Request;
export type QuickServerResponse = express.Response;
export type QuickServerNext = express.NextFunction;
export type QuickServerConfig = {
	routes: QuickServerRoutes;
	middlewares?: MiddlewareFunction[];
	handlers?: ApiHandlersRecord;
	options?: ApiOptions;
	app?: QuickServerApp;
};

export * from "./classes/index.js";
export * from "./lib/index.js";
export * from "./db/index.js";
export * from "./types/index.js";

export { Class, Utils, Database, QuickServerRouter }; 

export default class QuickServer extends Class.Base.Api {
	public readonly state = {
		started: false,
		stopped: false,
		error: false,
	};

	constructor(config: QuickServerConfig) {
		const { app = express(), routes, middlewares = [], handlers, options } = config;
		super(app, routes, [responseHelpers(), ...middlewares], handlers, options);
	}

	onInit(): void {
		this.logger.info("Server initialized successfully");
		this.state.started = false;
		this.state.stopped = false;
		this.state.error = false;
		this.emit("server_initialized");
	}

	onStart(): void {
		this.logger.info("Server started successfully");
		this.state.started = true;
		this.state.stopped = false;
		this.state.error = false;
		this.emit("server_started");
	}

	onStop(): void {
		this.logger.info("Server stopped successfully");
		this.state.started = false;
		this.state.stopped = true;
		this.emit("server_stopped");
	}

	onError(error: AppError): void {
		this.logger.error(`Error occurred: ${error.message}`);
		this.state.started = false;
		this.state.stopped = false;
		this.state.error = true;
		this.emit("server_error", error);
	}

	on(event: QuickServerEvents, callback: (...args: any[]) => void): void {
		this.app.on(event, callback);
	}

	emit(event: QuickServerEvents, ...args: any[]): void {
		this.app.emit(event, ...args);
	}
}
