import { NextFunction, Request, Response } from "express";
import { Namespace } from "socket.io";
import { ILimiterConfig } from "@Type/express/config.js";
import { Log } from "@/lib/logger.js";

export interface ControllerWrapperValue extends Partial<ILimiterConfig> {
	socket?: Namespace;
	logger?: Log;
}

export type ControllerFunction<
	Params = any,
	ReqBody = any,
	ResBody = any,
	ReqQuery = any,
> = (
	request: Request<Params, ResBody, ReqBody, ReqQuery>,
	response: Response,
	next: NextFunction,
) => void;

export type AsyncControllerFunction<
	Params = any,
	ReqBody = any,
	ResBody = any,
	ReqQuery = any,
> = (
	request: Request<Params, ResBody, ReqBody, ReqQuery>,
	response: Response,
	next: NextFunction,
) => Promise<void>;

export type WrappedControllerFunction<
	Params = any,
	ReqBody = any,
	ResBody = any,
	ReqQuery = any,
	Value = ControllerWrapperValue,
> = (
	value: Partial<Value>,
) => (
	request: Request<Params, ResBody, ReqBody, ReqQuery>,
	response: Response,
	next: NextFunction,
) => void;

export type WrappedAsyncControllerFunction<
	Params = any,
	ReqBody = any,
	ResBody = any,
	ReqQuery = any,
	Value = ControllerWrapperValue,
> = (
	value: Partial<Value>,
) => (
	request: Request<Params, ResBody, ReqBody, ReqQuery>,
	response: Response,
	next: NextFunction,
) => Promise<void>;


