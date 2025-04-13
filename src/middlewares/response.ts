import { Log } from "@/lib/logger.js";
import { MiddlewareFunction } from "@Type/express/middleware.js";
import HttpStatus from "http-status-values";
import { IStatusCode } from "@Type/common.js";
import AppError, { ExtendedErrorOptions, IErrorCode } from "@/classes/error.js";

export default function responseHelpers(logger?: Log): MiddlewareFunction {
	const extendedResponse: MiddlewareFunction = (req, resp, next) => {
		// Overloaded functions

		function response_ok<Data = {}>(
			dataOrStatus?: Data | IStatusCode,
			messageOrData?: string | Data,
			statusOrMessage?: IStatusCode | string,
		) {
			let status: IStatusCode;
			let message: string;
			let data: Data;
			let code: number;

			// Determine which overload is being used
			if (typeof dataOrStatus === "string" && HttpStatus.getStatusCode(dataOrStatus)) {
				// Second overload: (status, data, message)
				status = dataOrStatus as IStatusCode;
				data = messageOrData as Data;
				message = statusOrMessage ?? "Success";

				code = status ? HttpStatus.getStatusCode(status) ?? HttpStatus.OK : HttpStatus.OK;
			} else {
				// First overload: (data, message, status)
				data = dataOrStatus as Data;
				message = (messageOrData ?? "Success") as string;
				status = statusOrMessage as IStatusCode;

				code = status ? HttpStatus.getStatusCode(status) ?? HttpStatus.OK : HttpStatus.OK;
			}

			if (message) logger?.i(data, message);
			return resp.status(code ?? HttpStatus.OK).json(data ?? {});
		}

		function response_error(
			errorOrStatus?: AppError | IStatusCode,
			code?: IErrorCode,
			message?: string,
			options?: Partial<ExtendedErrorOptions>,
		) {
			let status: number;
			let error: AppError;

			if (AppError.isError(errorOrStatus)) {
				error = errorOrStatus;
				status = HttpStatus.getStatusCode(errorOrStatus.status) ?? HttpStatus.INTERNAL_SERVER_ERROR;
			} else {
				error = new AppError(
					code ?? "API_ERROR",
					errorOrStatus as IStatusCode,
					message ?? "An error occurred",
					options,
				);

				status = HttpStatus.getStatusCode(error.status) ?? HttpStatus.INTERNAL_SERVER_ERROR;
			}

			logger?.e(error, error.message);

			return resp.status(status).json({
				code: error.code,
				message: error.message,
			});
		}

		// Extend response object

		resp.error = response_error;
		resp.ok = response_ok;

		logger?.debug("(Middleware) responseHelpers: Response object extended", resp.ok, resp.error);

		next();
	};

	return extendedResponse;
}
