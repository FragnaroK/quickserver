import AppError from "../../classes/error.js";
export type ServiceWorkerBaseStatus = 'success' | 'error';
export type ServiceWorkerBaseEvents<Events = string> = 'start' | 'progress' | 'complete' | 'error' | 'cancelled' | 'status' | 'update' | 'message' | Events;
export type ServiceWorkerBaseEventHandler<Data = unknown, Operations = string, Events = string> = {
    [event in ServiceWorkerBaseEvents & Events]: (payload: ServiceWorkerBasePayload<Data, Operations>) => void;
};
export interface ServiceWorkerBasePayload<Data = unknown, Operations = string, Events = string> {
    operation: Operations;
    payload: Data;
    status: ServiceWorkerBaseStatus;
    error?: AppError;
    event?: ServiceWorkerBaseEvents<Events>;
}
