import Validator from "./validator.js";
import AppError, { ExtendedError, ExtendedErrorOptions, PreviousErrorData, IErrorCode, IErrorType } from "./error.js";
import Worker from "./abstract/workers/base.js";
import WorkerService from "./abstract/workers/serviceWorker.js";
import WorkerOperation from "./abstract/workers/workerOperation.js";
import Api, { ApiEnvironment } from "./abstract/express/api.js";
declare const Class: {
    readonly Validator: typeof Validator;
    readonly AppError: typeof AppError;
    readonly Base: {
        readonly Worker: typeof Worker;
        readonly WorkerService: typeof WorkerService;
        readonly WorkerOperation: typeof WorkerOperation;
        readonly Api: typeof Api;
    };
};
export type { ExtendedError, ExtendedErrorOptions, PreviousErrorData, IErrorCode, IErrorType, ApiEnvironment };
export default Class;
