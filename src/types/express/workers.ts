import AppError from "@Class/error.js";

export type ServiceWorkerBaseStatus = 'success' | 'error';
export type ServiceWorkerBaseEvents<Events = string> = 'start' | 'progress' | 'complete' | 'error' | 'cancelled' | 'status' | 'update' | 'message' | Events;

export type ServiceWorkerBaseEventHandlerFunction<EventData = string> = (payload: EventData) => void
 
export type ServiceWorkerBaseEventHandler<Data = string, Operations = string, Events = string> = {
    [event in ServiceWorkerBaseEvents & Events]: ServiceWorkerBaseEventHandlerFunction<ServiceWorkerBasePayload<Data, Operations>>;
};
export interface ServiceWorkerBasePayload<Data = unknown, Operations = string, Events = string> {
    operation: Operations;
    payload: Data;
    status?: ServiceWorkerBaseStatus;
    error?: AppError;
    event?: ServiceWorkerBaseEvents<Events>;
}