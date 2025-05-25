import { ServiceWorkerBaseEventHandler, ServiceWorkerBasePayload } from '@Type/express/workers.js';
import AppError from '@Class/error.js';
import Base from '@Class/abstract/common/base.js';

export default abstract class WorkerOperation<Payload = unknown, Operation = string, Events = string> extends Base {

    constructor(
        private readonly data: ServiceWorkerBasePayload<Payload, Operation>,
        private readonly port: MessagePort | null,
    ) {
        super();
    }

    protected get payload(): Payload {
        return this.data.payload;
    }

    protected get operation(): Operation {
        return this.data.operation;
    }

    protected send<Return = Payload>(payload: ServiceWorkerBasePayload<Return, Operation, Events>): void {
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
                logger: this.Logger,
            }),
        });
    }

    protected abstract start(): void;
}
