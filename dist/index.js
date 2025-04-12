import Class from "./classes/index.js";
import express from "express";
import responseHelpers from "./middlewares/response.js";
import health from "./routes/health.route.js";
import ping from "./routes/ping.route.js";
export * from './classes/index.js';
export * from './lib/index.js';
export * from './db/index.js';
export * from './types/index.js';
export default class QuickServer extends Class.Base.Api {
    constructor(routes, middlewares = [], handlers = {}, config, app = express()) {
        super(app, Object.assign(Object.assign({}, routes), { health: health(), ping: ping() }), [...middlewares, responseHelpers()], handlers, config);
        this.state = {
            started: false,
            stopped: false,
            error: false,
        };
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
