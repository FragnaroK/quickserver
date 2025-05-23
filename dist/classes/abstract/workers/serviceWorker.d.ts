import { ServiceWorkerBasePayload } from "@Type/express/workers.js";
import Base from "@/classes/abstract/common/base.js";
export default abstract class WorkerService extends Base {
    protected static createRunner<D = unknown, O = string>(workerName: string, buildFolder?: string, workerNameExtension?: string): {
        run: <ReturnData = D>(payload: ServiceWorkerBasePayload<D, O>) => Promise<ReturnData>;
    };
}
