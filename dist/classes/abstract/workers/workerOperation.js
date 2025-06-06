import AppError from '../../error.js';
import Base from '../../abstract/common/base.js';
export default class WorkerOperation extends Base {
    constructor(data, port) {
        super();
        this.data = data;
        this.port = port;
    }
    get payload() {
        return this.data.payload;
    }
    get operation() {
        return this.data.operation;
    }
    send(payload) {
        if (!this.port)
            throw new Error('Port is not available');
        this.port.postMessage(payload);
    }
    handleError(error) {
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
}
