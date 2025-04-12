import { IStatusCode } from "../../dist/index.d.ts";
import AppError, { ExtendedErrorOptions, IErrorCode } from "../../dist/classes/error.js";

export {};

interface ResponseOk {
	<Data = {}>(data?: Data, message?: string, status?: IStatusCode): any;
	<Data = {}>(status?: IStatusCode, data?: Data, message?: string): any;
}

interface ResponseError {
	(error?: AppError): void;
	(
		status?: IStatusCode,
		code?: IErrorCode,
		message?: string,
		options?: Partial<ExtendedErrorOptions>,
	): void;
}

declare global {
	namespace Express {
		export interface Response {
			error: ResponseError;
			ok: ResponseOk;
		}
	}
}
