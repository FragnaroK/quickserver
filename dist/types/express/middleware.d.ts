import { ExtendedError, Socket } from 'socket.io';
import { NextFunction, Response } from 'express';
export type SocketNextFunction = (err?: ExtendedError | undefined) => void;
export type SocketMiddlewareFunction = (socket: Socket, next: SocketNextFunction) => void;
export type MiddlewareFunction<T = unknown> = (request: T, response: Response, next: NextFunction) => void;
