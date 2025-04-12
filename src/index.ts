import { ApiConfig, ApiHandlersRecord } from "./classes/abstract/express/api.js";
import Class from "./classes/index.js";
import express, { Router } from "express";
import { MiddlewareFunction } from "./types/express/middleware.js";
import AppError from "./classes/error.js";
import responseHelpers from "./middlewares/response.js";
import health from "./routes/health.route.js";
import ping from "./routes/ping.route.js";
import Utils from './lib/index.js';
import Database from './db/index.js';

export type QuickServerEvents = "server_started" | "server_stopped" | "server_error";

export * from './classes/index.js';
export * from './lib/index.js';
export * from './db/index.js';
export * from './types/index.js';

export {
    Class,
    Utils,
    Database
}

export default class QuickServer extends Class.Base.Api {
	public readonly state = {
		started: false,
		stopped: false,
		error: false,
	};

	constructor(
		routes: Record<string, Router>,
		middlewares: MiddlewareFunction[] = [],
		handlers: ApiHandlersRecord = {},
		config?: ApiConfig,
		app: express.Express = express(),
	) {
		super(
			app,
			routes,
			[responseHelpers(), ...middlewares],
			handlers,
			config,
		);
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
