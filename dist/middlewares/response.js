import HttpStatus from "http-status-values";
import AppError from "@/classes/error.js";
export default function responseHelpers(logger) {
    const extendedResponse = (req, resp, next) => {
        function response_ok(dataOrStatus, messageOrData, statusOrMessage) {
            var _a, _b;
            let status;
            let message;
            let data;
            let code;
            if (typeof dataOrStatus === "string" && HttpStatus.getStatusCode(dataOrStatus)) {
                status = dataOrStatus;
                data = messageOrData;
                message = statusOrMessage !== null && statusOrMessage !== void 0 ? statusOrMessage : "Success";
                code = status ? (_a = HttpStatus.getStatusCode(status)) !== null && _a !== void 0 ? _a : HttpStatus.OK : HttpStatus.OK;
            }
            else {
                data = dataOrStatus;
                message = (messageOrData !== null && messageOrData !== void 0 ? messageOrData : "Success");
                status = statusOrMessage;
                code = status ? (_b = HttpStatus.getStatusCode(status)) !== null && _b !== void 0 ? _b : HttpStatus.OK : HttpStatus.OK;
            }
            if (message)
                logger === null || logger === void 0 ? void 0 : logger.i(data, message);
            return resp.status(code !== null && code !== void 0 ? code : HttpStatus.OK).json(data !== null && data !== void 0 ? data : {});
        }
        function response_error(errorOrStatus, code, message, options) {
            var _a, _b;
            let status;
            let error;
            if (AppError.isError(errorOrStatus)) {
                error = errorOrStatus;
                status = (_a = HttpStatus.getStatusCode(errorOrStatus.status)) !== null && _a !== void 0 ? _a : HttpStatus.INTERNAL_SERVER_ERROR;
            }
            else {
                error = new AppError(code !== null && code !== void 0 ? code : "API_ERROR", errorOrStatus, message !== null && message !== void 0 ? message : "An error occurred", options);
                status = (_b = HttpStatus.getStatusCode(error.status)) !== null && _b !== void 0 ? _b : HttpStatus.INTERNAL_SERVER_ERROR;
            }
            logger === null || logger === void 0 ? void 0 : logger.e(error, error.message);
            return resp.status(status).json({
                code: error.code,
                message: error.message,
            });
        }
        resp.error = response_error;
        resp.ok = response_ok;
        logger === null || logger === void 0 ? void 0 : logger.debug("(Middleware) responseHelpers: Response object extended", resp.ok, resp.error);
        next();
    };
    return extendedResponse;
}
