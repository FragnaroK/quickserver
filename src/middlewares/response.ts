import { Log } from "@/lib/logger.js";
import { MiddlewareFunction } from "@Type/express/middleware.js";
import HttpStatus from "http-status-values";
import { IStatusCode } from "@Type/common.js";
import AppError, { ExtendedErrorOptions, IErrorCode } from "@/classes/error.js";

export default function responseHelpers(logger?: Log): MiddlewareFunction {
	return (req, resp, next) => {
		// Overloaded functions

		function response_ok<Data = {}>(
			dataOrStatus?: Data | IStatusCode,
			messageOrData?: string | Data,
			statusOrMessage?: IStatusCode | string,
		) {
			// Determine which overload is being used
			if (
				typeof dataOrStatus === "string" &&
				HttpStatus.getStatusCode(dataOrStatus)
			) {
				// Second overload: (status, data, message)
				const status = dataOrStatus as IStatusCode;
				const data = messageOrData as Data;
				const message = statusOrMessage;

				if (message) logger?.i(data, message);
				const code = HttpStatus.getStatusCode(status);
				return resp.status(code ?? HttpStatus.OK).json(data ?? {});
			} else {
				// First overload: (data, message, status)
				const data = dataOrStatus as Data;
				const message = messageOrData as string | undefined;
				const status = statusOrMessage as IStatusCode | undefined;

				if (message) logger?.i(data, message);
				const code = status ? HttpStatus.getStatusCode(status) : HttpStatus.OK;
				return resp.status(code ?? HttpStatus.OK).json(data ?? {});
			}
		}

		function response_error(
			errorOrStatus?: AppError | IStatusCode,
			code?: IErrorCode,
			message?: string,
			options?: Partial<ExtendedErrorOptions>,
		) {
			if (AppError.isError(errorOrStatus)) {
				const status =
					HttpStatus.getStatusCode(errorOrStatus.status) ??
					HttpStatus.INTERNAL_SERVER_ERROR;
				logger?.e(errorOrStatus, errorOrStatus.message);
				return resp.status(status).json({
					code: errorOrStatus.code,
					message: errorOrStatus.message,
				});
			} else {
				const error = new AppError(
					code ?? "API_ERROR",
					errorOrStatus as IStatusCode,
					message ?? "An error occurred",
					options,
				);

				const status =
					HttpStatus.getStatusCode(error.status) ??
					HttpStatus.INTERNAL_SERVER_ERROR;

				logger?.e(error, error.message);
				return resp.status(status).json({
					code: error.code,
					message: error.message,
				});
			}
		}

		// Extend response object

		resp.error = response_error;
		resp.ok = response_ok;

		logger?.debug(
			"(Middleware) responseHelpers: Response object extended",
			resp.ok,
			resp.error,
		);

		next();
	};
}
