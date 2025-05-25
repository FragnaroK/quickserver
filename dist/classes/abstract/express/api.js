var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import helmet from "helmet";
import AppError from "../../error.js";
import createLogger from "../../../lib/logger.js";
import HttpStatus from "http-status-values";
import { pinoHttp } from "pino-http";
import health from "../../../routes/health.route.js";
import ping from "../../../routes/ping.route.js";
import Base from "../common/base.js";
const apiHandlers = ["notFound", "error"];
export default class Api extends Base {
    constructor(app, routes, middlewares = [], handlers = {}, config, logger) {
        var _a;
        super();
        this.app = app;
        this.routes = routes;
        this.middlewares = middlewares;
        this.handlers = handlers;
        this.config = config;
        this.registeredHandlers = [];
        this.logger = logger !== null && logger !== void 0 ? logger : createLogger("internal", "I-API", config === null || config === void 0 ? void 0 : config.DEBUG);
        this.basePath = (_a = config === null || config === void 0 ? void 0 : config.basePath) !== null && _a !== void 0 ? _a : "/api/v1";
        this.env = config;
        this.setupGracefulShutdown();
        this.init();
    }
    applyDefaultMiddlewares() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.app.use(pinoHttp({
            logger: createLogger("middleware", "API", (_a = this.config) === null || _a === void 0 ? void 0 : _a.DEBUG),
        }));
        this.app.use(helmet());
        this.app.use(cors((_b = this.config) === null || _b === void 0 ? void 0 : _b.corsOptions));
        if ((_c = this.config) === null || _c === void 0 ? void 0 : _c.trustProxy)
            this.app.set("trust proxy", (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.trustProxyValue) !== null && _e !== void 0 ? _e : true);
        this.app.use(express.json({
            limit: (_g = (_f = this.config) === null || _f === void 0 ? void 0 : _f.bodyParserLimit) !== null && _g !== void 0 ? _g : "1mb",
        }));
        this.app.use(express.urlencoded({
            extended: true,
            limit: (_j = (_h = this.config) === null || _h === void 0 ? void 0 : _h.bodyParserLimit) !== null && _j !== void 0 ? _j : "1mb",
        }));
        this.logger.debug("Applied default middlewares");
    }
    setMiddlewares() {
        var _a;
        for (const middleware of this.middlewares) {
            this.logger.debug(`Registering middleware: ${(_a = middleware.name) !== null && _a !== void 0 ? _a : "unknown"}`);
            this.app.use(middleware);
        }
        this.logger.debug(`Registered middlewares: ${this.middlewares.map((m) => { var _a; return (_a = m.name) !== null && _a !== void 0 ? _a : "unknown"; }).join(", ")}`);
        this.logger.info(`Total registered middlewares: ${this.middlewares.length}`);
    }
    setRoutes() {
        this.applyDefaultEndpoints();
        for (const [path, router] of Object.entries(this.routes)) {
            const fullPath = path.startsWith("/") ? `${this.basePath}${path}` : `${this.basePath}/${path}`;
            this.logger.debug(`Registering route: ${fullPath}`);
            this.app.use(fullPath, router);
        }
        this.logger.debug(`Registered routes: ${Object.keys(this.routes).join(", ")}`);
        this.logger.info(`Total registered routes: ${Object.keys(this.routes).length}`);
    }
    setHandlers() {
        if (!this.handlers || Object.keys(this.handlers).length === 0) {
            this.logger.debug("Setting up default handlers only");
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
            this.app.use(handlers[handler]);
        }
        this.logger.debug(`Registered handlers: ${this.registeredHandlers.join(", ")}`);
        this.logger.info(`Total registered handlers: ${this.registeredHandlers.length}`);
    }
    applyDefaultEndpoints() {
        this.logger.debug("Applying default endpoints: health, ping");
        this.app.use(`${this.basePath}/health`, health());
        this.app.get(`${this.basePath}/ping`, ping());
    }
    applyDefaultHandlers() {
        this.app.use((req, res, next) => {
            next(new AppError("NOT_FOUND", "NOT_FOUND", `Route ${req.method} ${req.url} not found`));
        });
        this.app.use((err, req, res, next) => {
            var _a;
            const error = AppError.isError(err)
                ? err
                : new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", err.message || "An unexpected error occurred", { data: err });
            this.onError(error);
            const status = (_a = HttpStatus.getStatusCode(error.status)) !== null && _a !== void 0 ? _a : 500;
            res.status(status).json(Object.assign({ status: error.status, code: error.code, message: this.env.DEBUG ? error.message : "An error occurred" }, (this.env.DEBUG && { stack: error.stack })));
        });
    }
    setupGracefulShutdown() {
        ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
            process.on(signal, () => __awaiter(this, void 0, void 0, function* () {
                this.logger.info(`${signal} received, shutting down...`);
                yield this.shutdown();
                process.exit(0);
            }));
        });
        process.on("uncaughtException", (error) => {
            this.logger.error("Uncaught exception", error);
            this.onError(new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Uncaught exception", { data: error }));
        });
        process.on("unhandledRejection", (reason) => {
            this.logger.error("Unhandled rejection", reason);
            this.onError(new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Unhandled rejection", { data: reason }));
        });
    }
    init() {
        var _a;
        this.logger.debug(`Initializing API with environment: ${JSON.stringify(this.env, null, 2)}`);
        this.applyDefaultMiddlewares();
        this.setMiddlewares();
        this.logger.debug("API initialized successfully");
        if (!((_a = this.config) === null || _a === void 0 ? void 0 : _a.autoStart))
            return;
        this.start()
            .then(() => {
            this.logger.info("API server started successfully");
            this.onInit();
            this.setRoutes();
            this.setHandlers();
        })
            .catch((err) => {
            this.logger.error("Error starting API server", err);
            this.onError(new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Error starting API server", {
                data: err,
            }));
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info("Starting API server...");
            if (this.server) {
                this.logger.warn("API server is already running");
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                this.server = this.app.listen(this.env.PORT, () => {
                    this.logger.info(`API server started on port ${this.env.PORT}`);
                    this.logger.debug(`API server is available at http://localhost:${this.env.PORT}${this.basePath}`);
                    this.logger.debug(`Debug mode is ${this.env.DEBUG ? "enabled" : "disabled"}`);
                    this.onStart();
                    resolve();
                });
                this.server.on("error", (err) => {
                    this.logger.error("Error starting API server", err);
                    this.onError(new AppError("API_ERROR", "INTERNAL_SERVER_ERROR", "Error starting API server", {
                        data: err,
                    }));
                    reject(err);
                });
            });
        });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info("Shutting down API server...");
            if (this.server) {
                return new Promise((resolve, reject) => {
                    this.server.close((err) => {
                        if (err) {
                            this.logger.error("Error shutting down API server", err);
                            reject(err);
                        }
                        else {
                            this.logger.info("API server shut down successfully");
                            this.onStop();
                            resolve();
                        }
                    });
                });
            }
            this.onStop();
        });
    }
}
