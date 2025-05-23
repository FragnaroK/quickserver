import { isLog } from "../lib/logger.js";
import HttpStatus from "http-status-values";
export default class AppError extends Error {
    constructor(code = "APP_ERROR", status = "INTERNAL_SERVER_ERROR", message = "Something went wrong", options = {}) {
        var _a, _b, _c;
        const prevError = AppError.carryPrevError(options === null || options === void 0 ? void 0 : options.data);
        if (prevError) {
            code = prevError.code;
            options.status = (_a = prevError.status) !== null && _a !== void 0 ? _a : HttpStatus.INTERNAL_SERVER_ERROR;
            options.type = (_b = prevError.type) !== null && _b !== void 0 ? _b : "DEFAULT";
            options.data = prevError.data;
        }
        if (!options.logger) {
            options = Object.assign(Object.assign({}, options), { logger: console });
        }
        super(message);
        this.code = code;
        this.status = status;
        this.message = message;
        this.options = options;
        AppError.logError(options.logger, code, message, options.data);
        (_c = options.cb) === null || _c === void 0 ? void 0 : _c.call(options);
        delete options.cb;
        delete options.logger;
    }
    static isError(error) {
        return error instanceof AppError;
    }
    static logError(logger, code, message, data) {
        if (!logger)
            return;
        const errorObj = data ? { details: data } : "";
        logger[isLog(logger) ? "e" : "error"](errorObj, `[${code}] ${AppError.getMessage(message)}`);
    }
    static carryPrevError(data) {
        var _a, _b, _c, _d;
        if (!data || !AppError.isError(data))
            return;
        const prevError = data;
        const error2carry = {
            code: prevError.code,
            type: (_b = (_a = prevError.options) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "DEFAULT",
            status: (_d = (_c = prevError.options) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : HttpStatus.INTERNAL_SERVER_ERROR,
            data: { from_error: prevError },
        };
        return error2carry;
    }
    static getMessage(message) {
        return String(message).replace(AppError.errorCodeRegExp, "").trim();
    }
}
AppError.errorCodeRegExp = /\[\w+_?\w*\]\s/g;
