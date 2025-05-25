import { ServiceWorkerBaseEventHandler, ServiceWorkerBasePayload } from "../../../types/express/workers.js";
import Base from "../../../classes/abstract/common/base.js";
export default class WorkerService extends Base {
    protected static createRunner<Payload = unknown, Operation = string, Events = string>(workerPath: string): {
        run: <ReturnData = Payload>(payload: ServiceWorkerBasePayload<Payload, Operation, Events>, events: ServiceWorkerBaseEventHandler<Payload, Operation, Events>) => Promise<ReturnData>;
    };
}
