import { IStatusCode } from "@Type/common.js";
import { Log } from "@/lib/logger.js";
interface IError2carry {
    code: IErrorCode;
    type: IErrorType;
    status: number;
    data: unknown;
}
export type IErrorCode = 'APP_ERROR' | 'CONTEXT_MISSING' | 'API_ERROR' | 'NOT_FOUND' | 'REQUEST_ERROR' | 'NOT_AUTHORIZED' | 'MISSING_VALUE' | 'INVALID_VALUE' | 'ENV_NOT_FOUND' | 'CORS_ERROR';
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
    code: IErrorCode;
    status: IStatusCode;
    message: string;
    options: Partial<ExtendedErrorOptions>;
    static readonly errorCodeRegExp: RegExp;
    constructor(code?: IErrorCode, status?: IStatusCode, message?: string, options?: Partial<ExtendedErrorOptions>);
    static isError(error: unknown): error is AppError;
    static logError(logger: Console | Log | undefined, code: IErrorCode, message: string, data?: unknown): void;
    static carryPrevError(data?: unknown): IError2carry | undefined;
    static getMessage(message: string): string;
}
export {};
