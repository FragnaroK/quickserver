import { Worker } from "worker_threads";
import AppError from "@Class/error.js";
import path from "path";
import {
	ServiceWorkerBaseEventHandler,
	ServiceWorkerBaseEvents,
	ServiceWorkerBasePayload,
} from "@Type/express/workers.js";
import { rootPath } from "get-root-path";
import Base from "@/classes/abstract/common/base.js";

export default class WorkerService extends Base {
	protected static createRunner<
		Payload = unknown,
		Operation = string,
		Events extends string | number | symbol = string,
	>(workerPath: string) {
		return {
			run: <ReturnData = Payload, EventData = Payload | ReturnData>(
				payload: ServiceWorkerBasePayload<Payload, Operation, Events>,
				events?: Partial<Record<ServiceWorkerBaseEvents<Events>, (data: string) => void>>,
			): Promise<ReturnData> =>
				new Promise((resolve, reject) => {
					this.Logger.d(payload, "Running worker with payload");
					const worker = new Worker(path.join(rootPath, workerPath), {
						workerData: payload,
					});

					worker.on(
						"message",
						(response: ServiceWorkerBasePayload<ReturnData, Operation, Events>) => {
							this.Logger.d(response, "Worker response");
							const event = !response.event
								? null
								: (response.event as keyof ServiceWorkerBaseEventHandler<Events>);

							if (events && Object.keys(events).length > 0 && event && event in events) {
								return events[event]?.(JSON.stringify(response));
							}

							return response.status === "success"
								? resolve(response.payload)
								: reject(response.error);
						},
					);

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
				}),
		};
	}
}
