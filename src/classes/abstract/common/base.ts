import createLogger, { Log } from "@/lib/logger.js";
import env from "env-util";
import { z } from "zod";

export default class Base { 

	protected static getDerivedClassName() {
		return this.name;
	}

	protected getDerivedClassName() {
		return this.constructor.name;
	}

	protected static get isTest(): boolean {
		return env.get("NODE_ENV", z.string(), { fallback: "" }) === "test";
	}

	protected static get isProd(): boolean {
		return env.get("NODE_ENV", z.string(), { fallback: "" }) === "production";
	}

	protected static get isDev(): boolean {
		return env.get("NODE_ENV", z.string(), { fallback: "" }) === "development";
	}

	protected static get isDebug(): boolean {
		return env.get<boolean>("DEBUG", z.coerce.boolean(), { fallback: false });
	}

	protected static get isLogging(): boolean {
		return env.get<boolean>("LOGGING", z.coerce.boolean(), { fallback: false });
	}

	protected get isTest(): boolean {
		return env.get("NODE_ENV", z.string(), { fallback: "" }) === "test";
	}

	protected get isProd(): boolean {
		return env.get("NODE_ENV", z.string(), { fallback: "" }) === "production";
	}

	protected get isDev(): boolean {
		return env.get("NODE_ENV", z.string(), { fallback: "" }) === "development";
	}

	protected get isDebug(): boolean {
		return env.get<boolean>("DEBUG", z.coerce.boolean(), { fallback: false });
	}

	protected get isLogging(): boolean {
		return env.get<boolean>("LOGGING", z.coerce.boolean(), { fallback: false });
	}

	public static readonly Logger: Log = createLogger('internal', this.getDerivedClassName(), this.isDebug);
	public readonly Logger: Log = createLogger('internal', this.getDerivedClassName(), this.isDebug);
}
