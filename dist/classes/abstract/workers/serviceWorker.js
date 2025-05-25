import { Worker } from "worker_threads";
import AppError from "../../error.js";
import path from "path";
import { rootPath } from "get-root-path";
import Base from "../../../classes/abstract/common/base.js";
export default class WorkerService extends Base {
    static createRunner(workerPath) {
        return {
            run: (payload, events) => {
                return new Promise((resolve, reject) => {
                    this.Logger.d(payload, "Running worker with payload");
                    const worker = new Worker(path.join(rootPath, workerPath), {
                        workerData: payload,
                    });
                    worker.on("message", (response) => {
                        this.Logger.d(response, "Worker response");
                        const event = !response.event
                            ? null
                            : response.event;
                        if (events && Object.keys(events).length > 0 && event && event in events) {
                            return events[event](response);
                        }
                        return response.status === "success"
                            ? resolve(response.payload)
                            : reject(response.error);
                    });
                    worker.on("error", (err) => {
                        this.Logger.e(err, "Worker error");
                        reject(new AppError("APP_ERROR", "INTERNAL_SERVER_ERROR", `Worker error: ${err.message}`));
                    });
                    worker.on("exit", (code) => {
                        if (code !== 0) {
                            this.Logger.e(code, "Worker exited with code");
                            reject(new AppError("APP_ERROR", "INTERNAL_SERVER_ERROR", `Worker exited with code ${code}`));
                        }
                    });
                });
            },
        };
    }
}
