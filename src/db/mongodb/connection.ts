import mongoose from 'mongoose';
import { Log } from '@/lib/logger.js';

/**
 * Mongoose Connection Helper
 * Connects to mongodb reliably with retries
 */
export default class MongoConnection {
    private readonly logger?: Log;
    private readonly mongoUrl: string;
    private onConnectedCallback: Function = () => {};
    private isConnectedBefore = false;

    /**
     * @param mongoUrl MongoDB connection url example: mongodb://localhost:27017/books
     */
    constructor(mongoUrl: string, logger?: Log) {
        this.logger = logger;
        this.mongoUrl = mongoUrl;
        mongoose.connection.on('error', this.onError);
        mongoose.connection.on('disconnected', this.onDisconnected);
        mongoose.connection.on('connected', this.onConnected);
        mongoose.connection.on('reconnected', this.onReconnected);
    }

    /**
     * Close connection to MongoDB
     * @param onClosed `err` passed as first argument in callback if there was an error while disconnecting
     */
    public close(onClosed: (err: Error) => void) {
        this.logger?.i('Closing the MongoDB conection');
        mongoose.connection.close().catch(onClosed);
    }

    /**
     * Attempt to connect to Mongo
     * @param onConnectedCallback Function to be called when connection is extablished
     */
    public async connect(onConnectedCallback?: Function) {
        this.logger?.i('Connecting to MongoDB');
        if (onConnectedCallback) {
            this.onConnectedCallback = onConnectedCallback;
        }
        await mongoose.connect(this.mongoUrl);
        mongoose.set('toJSON', { versionKey: false, virtuals: true });
        mongoose.set('toObject', { versionKey: false, virtuals: true });
    }

    /**
     * `onConnected` callback for mongoose
     */
    private readonly onConnected = () => {
        this.logger?.i('Connected to MongoDB');
        this.isConnectedBefore = true;
        this.onConnectedCallback();
    };

    /**
     * `onReconnected` callback for mongoose
     */
    private readonly onReconnected = () => {
        this.logger?.i('Reconnected to MongoDB');
    };

    /**
     * `onError` callback for mongoose
     */
    private readonly onError = () => {
        this.logger?.e(`Could not connect to MongoDB at ${this.mongoUrl}`);
    };

    /**
     * `onDisconnected` callback for mongoose
     */
    private readonly onDisconnected = () => {
        if (!this.isConnectedBefore) {
            this.logger?.w('Retrying MongoDB connection');
            setTimeout(() => {
                this.connect();
            }, 2000);
        }

        this.logger?.i('Disconnected from MongoDB');
    };
}
