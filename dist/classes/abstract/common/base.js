var _a;
import createLogger from "../../../lib/logger.js";
import env from "env-util";
import { z } from "zod";
export default class Base {
    constructor() {
        this.Logger = createLogger('internal', this.getDerivedClassName(), this.isDebug);
    }
    static getDerivedClassName() {
        return this.name;
    }
    getDerivedClassName() {
        return this.constructor.name;
    }
    static get isTest() {
        return env.get("NODE_ENV", z.string(), { fallback: "" }) === "test";
    }
    static get isProd() {
        return env.get("NODE_ENV", z.string(), { fallback: "" }) === "production";
    }
    static get isDev() {
        return env.get("NODE_ENV", z.string(), { fallback: "" }) === "development";
    }
    static get isDebug() {
        return env.get("DEBUG", z.coerce.boolean(), { fallback: false });
    }
    static get isLogging() {
        return env.get("LOGGING", z.coerce.boolean(), { fallback: false });
    }
    get isTest() {
        return env.get("NODE_ENV", z.string(), { fallback: "" }) === "test";
    }
    get isProd() {
        return env.get("NODE_ENV", z.string(), { fallback: "" }) === "production";
    }
    get isDev() {
        return env.get("NODE_ENV", z.string(), { fallback: "" }) === "development";
    }
    get isDebug() {
        return env.get("DEBUG", z.coerce.boolean(), { fallback: false });
    }
    get isLogging() {
        return env.get("LOGGING", z.coerce.boolean(), { fallback: false });
    }
}
_a = Base;
Base.Logger = createLogger('internal', _a.getDerivedClassName(), _a.isDebug);
