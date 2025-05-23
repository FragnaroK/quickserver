import { Worker } from "worker_threads";
import AppError from "@Class/error.js";
import path from "path";
import { ServiceWorkerBasePayload } from "@Type/express/workers.js";
import { rootPath } from "get-root-path";
import Base from "@/classes/abstract/common/base.js";


export default abstract class WorkerService extends Base {
	protected static createRunner<D = unknown, O = string>(
		workerName: string,
		buildFolder: string = "build",
		workerNameExtension: string = ".worker.js",
	) {
		return {
			run: <ReturnData = D>(payload: ServiceWorkerBasePayload<D, O>): Promise<ReturnData> => {
				return new Promise((resolve, reject) => {
					this.Logger.d(payload, "Running worker with payload");
					const worker = new Worker(
						path.join(
							rootPath,
							`${buildFolder}`,
							"src",
							"workers",
							`${workerName}${workerNameExtension}`,
						),
						{
							workerData: payload,
						},
					);

					worker.on("message", (response: ServiceWorkerBasePayload<ReturnData, O>) => {
						this.Logger.d(response, "Worker response");
						if (response.status === "success") {
							resolve(response.payload);
						} else {
							reject(response.error);
						}
					});

					worker.on("error", (err) => {
						this.Logger.e(err, "Worker error");
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
							this.Logger.e(code, "Worker exited with code");
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