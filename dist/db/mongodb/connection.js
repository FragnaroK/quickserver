var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
export default class MongoConnection {
    constructor(mongoUrl, logger) {
        this.onConnectedCallback = () => { };
        this.isConnectedBefore = false;
        this.onConnected = () => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.i('Connected to MongoDB');
            this.isConnectedBefore = true;
            this.onConnectedCallback();
        };
        this.onReconnected = () => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.i('Reconnected to MongoDB');
        };
        this.onError = () => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.e(`Could not connect to MongoDB at ${this.mongoUrl}`);
        };
        this.onDisconnected = () => {
            var _a, _b;
            if (!this.isConnectedBefore) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.w('Retrying MongoDB connection');
                setTimeout(() => {
                    this.connect();
                }, 2000);
            }
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.i('Disconnected from MongoDB');
        };
        this.logger = logger;
        this.mongoUrl = mongoUrl;
        mongoose.connection.on('error', this.onError);
        mongoose.connection.on('disconnected', this.onDisconnected);
        mongoose.connection.on('connected', this.onConnected);
        mongoose.connection.on('reconnected', this.onReconnected);
    }
    close(onClosed) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.i('Closing the MongoDB conection');
        mongoose.connection.close().catch(onClosed);
    }
    connect(onConnectedCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.i('Connecting to MongoDB');
            if (onConnectedCallback) {
                this.onConnectedCallback = onConnectedCallback;
            }
            yield mongoose.connect(this.mongoUrl);
            mongoose.set('toJSON', { versionKey: false, virtuals: true });
            mongoose.set('toObject', { versionKey: false, virtuals: true });
        });
    }
}
