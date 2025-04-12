import { ServiceWorkerBasePayload } from "@Type/express/workers.js";
import WorkerBase from "@Class/abstract/workers/base.js";
import { Log } from "@/lib/logger.js";
export default abstract class WorkerService extends WorkerBase {
    protected static logger: Log;
    protected static createRunner<D = unknown, O = string>(workerName: string): {
        run: <ReturnData = D>(payload: ServiceWorkerBasePayload<D, O>) => Promise<ReturnData>;
    };
}
