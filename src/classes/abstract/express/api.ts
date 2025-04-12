import express, { Express, Router, RequestHandler, Request, Response, NextFunction } from "express";
import * as http from "http";
import cors from "cors";
import helmet from "helmet";
import { MiddlewareFunction } from "@/types/express/middleware.js";
import AppError from "@Class/error.js";
import createLogger, { Log } from "@/lib/logger.js";
import HttpStatus from "http-status-values";
import { pinoHttp } from "pino-http";
import health from "@/routes/health.route.js";
import ping from "@/routes/ping.route.js";

// TODO: All express related code in this package should be moved to a separate package
/* 
note: The complexity of the code makes it no longer suitable as a simple utility.

This could be converted to a template or very bare-bones framework for building APIs.
*/

// This array ensures that the handlers are loaded in the correct order
const apiHandlers: Readonly<ApiHandler[]> = ["notFound", "error"] as const;

export type ApiHandler = "notFound" | "error";
export type ApiDefaultEndpoints = "health" | "ping";

export type ApiHandlersRecord = Partial<Record<ApiHandler, MiddlewareFunction>>

export type ApiEnvironment = {
	DEBUG: boolean;
	PORT: number;
} & { [key: string]: any };

export type ApiConfig = {
	basePath?: string;
	corsOptions?: cors.CorsOptions;
	bodyParserLimit?: string;
	trustProxy?: boolean;
	trustProxyValue?: any;
	autoStart?: boolean;
} & ApiEnvironment;

export default abstract class Api {
	private readonly registeredHandlers: ApiHandler[] = [];
	protected readonly logger: Log;
	protected server: http.Server | undefined;
	protected basePath: string;
	protected env: ApiEnvironment;

	/**
	 * Creates a new API instance
	 *
	 * @param app Express application instance
	 * @param config API configuration
	 * @param routes Route definitions
	 * @param middlewares Custom middleware functions
	 * @param handlers Special API handlers
	 * @param logger Optional custom logger
	 */
	constructor(
		protected readonly app: Express,
		protected readonly routes: Record<string, Router>,
		protected readonly middlewares: RequestHandler[] = [],
		protected readonly handlers: ApiHandlersRecord = {},
		protected readonly config?: ApiConfig,
		logger?: Log,
	) {
		this.logger = logger ?? createLogger("internal", "I-API", config?.DEBUG);
		this.basePath = config?.basePath ?? "/api/v1";
		this.env = config as ApiEnvironment;
		this.setupGracefulShutdown();
		this.init();
	}

	/**
	 * Set up default middleware like security headers, CORS, etc.
	 */
	private applyDefaultMiddlewares(): void {
		// Add request logging
		this.app.use(
			pinoHttp({
				logger: createLogger("middleware", "API", this.config?.DEBUG),
			}),
		);

		// Add security headers
		this.app.use(helmet());

		// Add CORS support
		this.app.use(cors(this.config?.corsOptions));

		// Trust proxy if configured (useful behind load balancers)
		if (this.config?.trustProxy) this.app.set("trust proxy", this.config?.trustProxyValue ?? true);

		// Parse JSON with configurable limit
		this.app.use(
			express.json({
				limit: this.config?.bodyParserLimit ?? "1mb",
			}),
		);

		// Parse URL-encoded bodies
		this.app.use(
			express.urlencoded({
				extended: true,
				limit: this.config?.bodyParserLimit ?? "1mb",
			}),
		);

		this.logger.debug("Applied default middlewares");
	}

	/**
	 * Register custom middlewares
	 */
	private setMiddlewares() {
		for (const middleware of this.middlewares) {
			this.logger.debug(`Registering middleware: ${middleware.name ?? "unknown"}`);
			this.logger.debug(JSON.stringify(middleware, null, 2));
			this.app.use(middleware);
		}

		this.logger.debug(
			`Registered middlewares: ${this.middlewares.map((m) => m.name ?? "unknown").join(", ")}`,
		);
		this.logger.info(`Total registered middlewares: ${this.middlewares.length}`);
	}

	/**
	 * Register API routes
	 */
	private setRoutes() {
		this.applyDefaultEndpoints();

		for (const [path, router] of Object.entries(this.routes)) {
			const fullPath = path.startsWith("/") ? `${this.basePath}${path}` : `${this.basePath}/${path}`;

			this.logger.debug(`Registering route: ${fullPath}`);
			this.app.use(fullPath, router);
		}

		this.logger.debug(`Registered routes: ${Object.keys(this.routes).join(", ")}`);
		this.logger.info(`Total registered routes: ${Object.keys(this.routes).length}`);
	}

	/**
	 * Register special API handlers (not found, error, etc.)
	 */
	private setHandlers() {
		if (!this.handlers || Object.keys(this.handlers).length === 0) {
			this.logger.debug("Setting up default handlers only");
			// Set up default not found and error handlers
			this.applyDefaultHandlers();
			return;
		}

		const handlers = this.handlers;
		for (const handler of apiHandlers) {
			if (!handlers[handler]) {
				this.logger.debug(`Handler ${handler} not found, skipping...`);
				continue;
			}
			this.logger.debug(`Registering handler: ${handler}`);
			this.registeredHandlers.push(handler);
			this.app.use(handlers[handler] as MiddlewareFunction);
		}

		this.logger.debug(`Registered handlers: ${this.registeredHandlers.join(", ")}`);
		this.logger.info(`Total registered handlers: ${this.registeredHandlers.length}`);
	}

	private applyDefaultEndpoints(): void {
		this.logger.debug("Applying default endpoints: health, ping");

		// Health check endpoint
		this.app.use(`${this.basePath}/health`, health());

		// Ping endpoint
		this.app.get(`${this.basePath}/ping`, ping());
	}

	/**
	 * Apply default 404 and error handlers
	 */
	private applyDefaultHandlers(): void {
		// Add default 404 handler
		this.app.use((req, res, next) => {
			next(new AppError("NOT_FOUND", "NOT_FOUND", `Route ${req.method} ${req.url} not found`));
		});

		// Add default error handler
		this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			const error = AppError.isError(err)
				? err
				: new AppError(
						"API_ERROR",
						"INTERNAL_SERVER_ERROR",
						err.message || "An unexpected error occurred",
						{ data: err },
				  );

			this.onError(error);

			const status = HttpStatus.getStatusCode(error.status) ?? 500;
			res.status(status).json({
				status: error.status,
				code: error.code,
				message: this.env.DEBUG ? error.message : "An error occurred",
				...(this.env.DEBUG && { stack: error.stack }),
			});
		});
	}

	/**
	 * Set up graceful shutdown handlers
	 */
	private setupGracefulShutdown(): void {
		["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
			process.on(signal, async () => {
				this.logger.info(`${signal} received, shutting down...`);
				await this.shutdown();
				process.exit(0);
			});
		});

		process.on("uncaughtException", (error) => {
			this.logger.error("Uncaught exception", error);
			this.onError(
				new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Uncaught exception", { data: error }),
			);
		});

		process.on("unhandledRejection", (reason) => {
			this.logger.error("Unhandled rejection", reason);
			this.onError(
				new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Unhandled rejection", { data: reason }),
			);
		});
	}

	/**
	 * Initialize the API server
	 */
	private init(): void {
		this.logger.debug(`Initializing API with environment: ${JSON.stringify(this.env, null, 2)}`);

		// Apply default middlewares
		this.applyDefaultMiddlewares();

		// Apply custom middlewares
		this.setMiddlewares();

		// Set up routes
		this.setRoutes();

		// Set up handlers (404, errors, etc.)
		this.setHandlers();

		this.logger.debug("API initialized successfully");

		// Start the server if not disabled
		if (!this.config?.autoStart) return;
		this.start()
			.then(() => this.logger.info("API server started successfully"))
			.catch((err) => {
				this.logger.error("Error starting API server", err);
				this.onError(
					new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Error starting API server", {
						data: err,
					}),
				);
			});
	}

	/**
	 * Start the API server
	 */
	public async start(): Promise<void> {
		this.logger.info("Starting API server...");
		if (this.server) {
			this.logger.warn("API server is already running");
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			this.server = this.app.listen(this.env.PORT, () => {
				this.logger.info(`API server started on port ${this.env.PORT}`);
				this.logger.debug(
					`API server is available at http://localhost:${this.env.PORT}${this.basePath}`,
				);
				this.logger.debug(`Debug mode is ${this.env.DEBUG ? "enabled" : "disabled"}`);
				this.onStart();
				resolve();
			});

			this.server.on("error", (err) => {
				this.logger.error("Error starting API server", err);
				this.onError(
					new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Error starting API server", {
						data: err,
					}),
				);
				reject(err);
			});
		});
	}

	/**
	 * Gracefully shut down the API server
	 */
	public async shutdown(): Promise<void> {
		this.logger.info("Shutting down API server...");

		if (this.server) {
			return new Promise((resolve, reject) => {
				this.server!.close((err) => {
					if (err) {
						this.logger.error("Error shutting down API server", err);
						reject(err);
					} else {
						this.logger.info("API server shut down successfully");
						this.onStop();
						resolve();
					}
				});
			});
		}

		this.onStop();
	}

	/**
	 * Called when the API server starts successfully
	 */
	abstract onStart(): void;

	/**
	 * Called when the API server stops
	 */
	abstract onStop(): void;

	/**
	 * Called when an error occurs in the API server
	 */
	abstract onError(error: AppError): void;
}
