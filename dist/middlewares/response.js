import HttpStatus from "http-status-values";
import AppError from "../classes/error.js";
export default function responseHelpers(logger) {
    const extendedResponse = (req, resp, next) => {
        function response_ok(dataOrStatus, messageOrData, statusOrMessage) {
            if (typeof dataOrStatus === "string" &&
                HttpStatus.getStatusCode(dataOrStatus)) {
                const status = dataOrStatus;
                const data = messageOrData;
                const message = statusOrMessage;
                if (message)
                    logger === null || logger === void 0 ? void 0 : logger.i(data, message);
                const code = HttpStatus.getStatusCode(status);
                return resp.status(code !== null && code !== void 0 ? code : HttpStatus.OK).json(data !== null && data !== void 0 ? data : {});
            }
            else {
                const data = dataOrStatus;
                const message = messageOrData;
                const status = statusOrMessage;
                if (message)
                    logger === null || logger === void 0 ? void 0 : logger.i(data, message);
                const code = status ? HttpStatus.getStatusCode(status) : HttpStatus.OK;
                return resp.status(code !== null && code !== void 0 ? code : HttpStatus.OK).json(data !== null && data !== void 0 ? data : {});
            }
        }
        function response_error(errorOrStatus, code, message, options) {
            var _a, _b;
            if (AppError.isError(errorOrStatus)) {
                const status = (_a = HttpStatus.getStatusCode(errorOrStatus.status)) !== null && _a !== void 0 ? _a : HttpStatus.INTERNAL_SERVER_ERROR;
                logger === null || logger === void 0 ? void 0 : logger.e(errorOrStatus, errorOrStatus.message);
                return resp.status(status).json({
                    code: errorOrStatus.code,
                    message: errorOrStatus.message,
                });
            }
            else {
                const error = new AppError(code !== null && code !== void 0 ? code : "API_ERROR", errorOrStatus, message !== null && message !== void 0 ? message : "An error occurred", options);
                const status = (_b = HttpStatus.getStatusCode(error.status)) !== null && _b !== void 0 ? _b : HttpStatus.INTERNAL_SERVER_ERROR;
                logger === null || logger === void 0 ? void 0 : logger.e(error, error.message);
                return resp.status(status).json({
                    code: error.code,
                    message: error.message,
                });
            }
        }
        resp.error = response_error;
        resp.ok = response_ok;
        logger === null || logger === void 0 ? void 0 : logger.debug("(Middleware) responseHelpers: Response object extended", resp.ok, resp.error);
        next();
    };
    return extendedResponse;
}
