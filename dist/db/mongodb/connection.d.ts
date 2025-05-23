import { Log } from '@/lib/logger.js';
export default class MongoConnection {
    private readonly logger?;
    private readonly mongoUrl;
    private onConnectedCallback;
    private isConnectedBefore;
    constructor(mongoUrl: string, logger?: Log);
    close(onClosed: (err: Error) => void): void;
    connect(onConnectedCallback?: Function): Promise<void>;
    private readonly onConnected;
    private readonly onReconnected;
    private readonly onError;
    private readonly onDisconnected;
}
