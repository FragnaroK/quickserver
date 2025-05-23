import { ServiceWorkerBasePayload } from "@Type/express/workers.js";
import Base from "@/classes/abstract/common/base.js";
import { Log } from "@/lib/logger.js";
export default abstract class WorkerService extends Base {
    protected static logger: Log;
    protected static createRunner<D = unknown, O = string>(workerName: string): {
        run: <ReturnData = D>(payload: ServiceWorkerBasePayload<D, O>) => Promise<ReturnData>;
    };
}
