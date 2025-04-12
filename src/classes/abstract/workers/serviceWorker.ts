import { Worker } from "worker_threads";
import AppError from "@Class/error.js";
import path from "path";
import { ServiceWorkerBasePayload } from "@Type/express/workers.js";
import { rootPath } from "get-root-path";
import WorkerBase from "@Class/abstract/workers/base.js";
import { Log } from "@/lib/logger.js";

export default abstract class WorkerService extends WorkerBase {
	protected static logger: Log;

	protected static createRunner<D = unknown, O = string>(workerName: string) {
		return {
			run: <ReturnData = D>(
				payload: ServiceWorkerBasePayload<D, O>,
			): Promise<ReturnData> => {
				return new Promise((resolve, reject) => {
					// Path needs to be the build output folder

					this.logger.d(payload, "Running worker with payload");
					const worker = new Worker(
						path.join(
							rootPath,
							"build/src/workers",
							`${workerName}.worker.js`,
						),
						{
							workerData: payload,
						},
					);

					worker.on(
						"message",
						(response: ServiceWorkerBasePayload<ReturnData, O>) => {
							this.logger.d(response, "Worker response");
							if (response.status === "success") {
								resolve(response.payload);
							} else {
								reject(response.error);
							}
						},
					);

					worker.on("error", (err) => {
						this.logger.e(err, "Worker error");
						reject(
							new AppError(
								"APP_ERROR",
								"INTERNAL_SERVER_ERROR",
								`Worker error: ${err.message}`,
							),
						);
					});

					worker.on("exit", (code) => {
						if (code !== 0) {
							this.logger.e(code, "Worker exited with code");
							reject(
								new AppError(
									"APP_ERROR",
									"INTERNAL_SERVER_ERROR",
									`Worker exited with code ${code}`,
								),
							);
						}
					});
				});
			},
		};
	}
}
