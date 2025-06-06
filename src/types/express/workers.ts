import AppError from "@Class/error.js";


export type ServiceWorkerBaseStatus = 'success' | 'error';
export type ServiceWorkerBaseEvents<CustomEvents = never> = 'start' | 'progress' | 'complete' | 'error' | 'cancelled' | 'status' | 'update' | 'message' | CustomEvents;

export interface ServiceWorkerBasePayload<Data = unknown, Operations = string, Events = never> {
    operation: Operations;
    payload: Data;
    status?: ServiceWorkerBaseStatus;
    error?: AppError;
    event?: ServiceWorkerBaseEvents<Events>;
}

export type ServiceWorkerBaseEventHandler<Events = never> = {
    [event in ServiceWorkerBaseEvents<Events extends string ? Events : never>]?: (payload: string) => void;
};
