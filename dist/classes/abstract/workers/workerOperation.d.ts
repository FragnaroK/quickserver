import { ServiceWorkerBasePayload } from '../../../types/express/workers.js';
import Base from '../../abstract/common/base.js';
export default abstract class WorkerOperation<Payload = unknown, Operation = string> extends Base {
    private readonly data;
    private readonly port;
    constructor(data: ServiceWorkerBasePayload<Payload, Operation>, port: MessagePort | null);
    protected get payload(): Payload;
    protected get operation(): Operation;
    protected send<Return = Payload>(payload: ServiceWorkerBasePayload<Return, Operation>): void;
    protected handleError(error: Error): void;
    protected abstract start(): void;
}
