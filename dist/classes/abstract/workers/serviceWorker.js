import { Worker } from "worker_threads";
import AppError from "../../error.js";
import path from "path";
import { rootPath } from "get-root-path";
import Base from "../../../classes/abstract/common/base.js";
export default class WorkerService extends Base {
    static createRunner(workerName) {
        return {
            run: (payload) => {
                return new Promise((resolve, reject) => {
                    this.logger.d(payload, "Running worker with payload");
                    const worker = new Worker(path.join(rootPath, "build/src/workers", `${workerName}.worker.js`), {
                        workerData: payload,
                    });
                    worker.on("message", (response) => {
                        this.logger.d(response, "Worker response");
                        if (response.status === "success") {
                            resolve(response.payload);
                        }
                        else {
                            reject(response.error);
                        }
                    });
                    worker.on("error", (err) => {
                        this.logger.e(err, "Worker error");
                        reject(new AppError("APP_ERROR", "INTERNAL_SERVER_ERROR", `Worker error: ${err.message}`));
                    });
                    worker.on("exit", (code) => {
                        if (code !== 0) {
                            this.logger.e(code, "Worker exited with code");
                            reject(new AppError("APP_ERROR", "INTERNAL_SERVER_ERROR", `Worker exited with code ${code}`));
                        }
                    });
                });
            },
        };
    }
}
