import { ServiceWorkerBaseEvents, ServiceWorkerBasePayload } from "../../../types/express/workers.js";
import Base from "../../../classes/abstract/common/base.js";
export default class WorkerService extends Base {
    protected static createRunner<Payload = unknown, Operation = string, Events extends string | number | symbol = string>(workerPath: string): {
        run: <ReturnData = Payload, EventData = Payload | ReturnData>(payload: ServiceWorkerBasePayload<Payload, Operation, Events>, events?: Partial<Record<ServiceWorkerBaseEvents<Events>, (data: string) => void>> | undefined) => Promise<ReturnData>;
    };
}
