import { ServiceWorkerBasePayload } from '@Type/express/workers.js';
import WorkerBase from '@Class/abstract/workers/base.js';
import { Log } from '@/lib/logger.js';
export default abstract class WorkerOperation<Data = unknown, Operation = string> extends WorkerBase {
    private readonly data;
    private readonly port;
    protected logger: Log;
    constructor(name: string, data: ServiceWorkerBasePayload<Data, Operation>, port: MessagePort | null);
    protected get payload(): Data;
    protected get operation(): Operation;
    protected send<Return = Data>(payload: ServiceWorkerBasePayload<Return, Operation>): void;
    protected handleError(error: Error): void;
    protected abstract start(): void;
}
