import { ServiceWorkerBasePayload } from '@Type/express/workers.js';
import AppError from '@Class/error.js';
import Base from '@Class/abstract/common/base.js';
import path from 'path';
import createLogger, { Log } from '@/lib/logger.js';

// Base class for worker operation files located in the backend/src/workers directory
export default abstract class WorkerOperation<Data = unknown, Operation = string> extends Base {
    protected logger: Log;

    constructor(
        name: string,
        private readonly data: ServiceWorkerBasePayload<Data, Operation>,
        private readonly port: MessagePort | null,
    ) {
        super();
        const cleanFilename = path.basename(name).replace('.worker.js', '').toLocaleUpperCase();
        this.logger = createLogger('internal', `WORKER::${cleanFilename}::${data.operation}`, this.isDebug);
    }

    protected get payload(): Data {
        return this.data.payload;
    }

    protected get operation(): Operation {
        return this.data.operation;
    }

    protected send<Return = Data>(payload: ServiceWorkerBasePayload<Return, Operation>) {
        if (!this.port) throw new Error('Port is not available');

        this.port.postMessage(payload);
    }

    protected handleError(error: Error) {
        this.send({
            operation: this.operation,
            payload: this.payload,
            status: 'error',
            error: new AppError('APP_ERROR', 'INTERNAL_SERVER_ERROR', error.message, {
                data: error,
                logger: this.logger,
            }),
        });
    }

    protected abstract start(): void;
}
