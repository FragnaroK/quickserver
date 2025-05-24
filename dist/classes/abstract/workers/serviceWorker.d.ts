import { ServiceWorkerBasePayload } from "../../../types/express/workers.js";
import Base from "../../../classes/abstract/common/base.js";
export default class WorkerService extends Base {
    protected static createRunner<D = unknown, O = string>(workerPath: string): {
        run: <ReturnData = D>(payload: ServiceWorkerBasePayload<D, O>) => Promise<ReturnData>;
    };
}
