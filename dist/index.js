import Class from "./classes/index.js";
import express, { Router as QuickServerRouter } from "express";
import responseHelpers from "./middlewares/response.js";
import Utils from "./lib/index.js";
import Database from "./db/index.js";
export * from "./classes/index.js";
export * from "./lib/index.js";
export * from "./db/index.js";
export * from "./types/index.js";
export { Class, Utils, Database, QuickServerRouter };
export default class QuickServer extends Class.Base.Api {
    constructor(config) {
        const { app = express(), routes, middlewares = [], handlers, options } = config;
        super(app, routes, [responseHelpers(), ...middlewares], handlers, options);
        this.state = {
            started: false,
            stopped: false,
            error: false,
        };
    }
    onInit() {
        this.logger.info("Server initialized successfully");
        this.state.started = false;
        this.state.stopped = false;
        this.state.error = false;
        this.emit("server_initialized");
    }
    onCreate(server) {
        this.logger.info("Server created successfully");
        this.server = server;
        this.state.started = false;
        this.state.stopped = false;
        this.state.error = false;
        this.emit("server_created");
    }
    onStart() {
        this.logger.info("Server started successfully");
        this.state.started = true;
        this.state.stopped = false;
        this.state.error = false;
        this.emit("server_started");
    }
    onStop() {
        this.logger.info("Server stopped successfully");
        this.state.started = false;
        this.state.stopped = true;
        this.emit("server_stopped");
    }
    onError(error) {
        this.logger.error(`Error occurred: ${error.message}`);
        this.state.started = false;
        this.state.stopped = false;
        this.state.error = true;
        this.emit("server_error", error);
    }
    on(event, callback) {
        this.app.on(event, callback);
    }
    emit(event, ...args) {
        this.app.emit(event, ...args);
    }
}
