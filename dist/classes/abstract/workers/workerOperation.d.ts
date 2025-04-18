import { ServiceWorkerBasePayload } from '../../../types/express/workers.js';
import Base from '../../abstract/common/base.js';
import { Log } from '../../../lib/logger.js';
export default abstract class WorkerOperation<Data = unknown, Operation = string> extends Base {
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
