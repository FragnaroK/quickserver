import Validator from "./validator.js";
import AppError, {
	ExtendedError,
	ExtendedErrorOptions,
	PreviousErrorData,
	IErrorCode,
	IErrorType,
} from "./error.js";

import Worker from "./abstract/workers/base.js";
import WorkerService from "./abstract/workers/serviceWorker.js";
import WorkerOperation from "./abstract/workers/workerOperation.js";
import Api, { ApiEnvironment } from "./abstract/express/api.js"; 

const Base = {
	Worker,
	WorkerService,
	WorkerOperation,
	Api,
} as const;

const Class = {
	Validator,
	AppError,
	Base,
} as const;

export type {
	ExtendedError,
	ExtendedErrorOptions,
	PreviousErrorData,
	IErrorCode,
	IErrorType,
	ApiEnvironment
};

export default Class;
