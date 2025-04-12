import { IStatusCode, ObjectType } from "@Type/common.js";
import { Log, isLog } from "@/lib/logger.js";
import HttpStatus from "http-status-values";

interface IError2carry {
	code: IErrorCode;
	type: IErrorType;
	status: number;
	data: unknown;
}

export type IErrorCode = 
| 'APP_ERROR'
| 'CONTEXT_MISSING'
| 'API_ERROR'
| 'NOT_FOUND'
| 'REQUEST_ERROR'
| 'NOT_AUTHORIZED'
| 'MISSING_VALUE'
| 'INVALID_VALUE'
| 'ENV_NOT_FOUND'
| 'CORS_ERROR';

export type IErrorType = 'CORS' | 'DEFAULT'; 

export interface ExtendedErrorOptions {
	data: unknown;
	logger: Console | Log;
	stack: string;
	type: IErrorType;
	status?: number;
	cb: () => void;
}

export interface ExtendedError {
	code: IErrorCode;
	message: string;
	options?: Partial<ExtendedErrorOptions>;
}

export interface PreviousErrorData {
	message: string;
	code: string;
}

export default class AppError extends Error implements ExtendedError {
	static readonly errorCodeRegExp = /\[\w+_?\w*\]\s/g;

	constructor(
		public code: IErrorCode = "APP_ERROR",
		public status: IStatusCode = "INTERNAL_SERVER_ERROR",
		public message: string = "Something went wrong",
		public options: Partial<ExtendedErrorOptions> = {},
	) {
		const prevError = AppError.carryPrevError(options?.data);

		if (prevError) {
			code = prevError.code;
			options.status = prevError.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
			options.type = prevError.type ?? "DEFAULT";
			options.data = prevError.data;
		}

		if (!options.logger) {
			options = {
				...options,
				// logger: DefaultConfig.Logger.CHAT_SERVER,
				logger: console,
			};
		}

		super(message);

		AppError.logError(options.logger, code, message, options.data);

		options.cb?.();

		delete options.cb;
		delete options.logger;
	}

	static isError(error: unknown): error is AppError {
		return error instanceof AppError;
	}

	static logError(
		logger: Console | Log | undefined,
		code: IErrorCode,
		message: string,
		data?: unknown,
	) {
		if (!logger) return;

		const errorObj = data ? { details: data } : "";

		(logger as ObjectType<any>)[isLog(logger) ? "e" : "error"](
			errorObj,
			`[${code}] ${AppError.getMessage(message)}`,
		);
	}

	static carryPrevError(data?: unknown): IError2carry | undefined {
		if (!data || !AppError.isError(data)) return;

		const prevError = data;
		const error2carry: IError2carry = {
			code: prevError.code,
			type: prevError.options?.type ?? "DEFAULT",
			status: prevError.options?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
			data: { from_error: prevError },
		};

		return error2carry;
	}

	static getMessage(message: string): string {
		return String(message).replace(AppError.errorCodeRegExp, "").trim();
	}
}
