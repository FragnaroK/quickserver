import AppError from "../../classes/error.js";
export type ServiceWorkerBaseStatus = 'success' | 'error';
export interface ServiceWorkerBasePayload<Data = unknown, Operations = string> {
    operation: Operations;
    payload: Data;
    status?: ServiceWorkerBaseStatus;
    error?: AppError;
}
