import env from "env-util";
import { z } from "zod";
export default class Base {
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
        return env.get("DEBUG", z.boolean(), { fallback: false });
    }
    static get isLogging() {
        return env.get("LOGGING", z.boolean(), { fallback: false });
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
        return env.get("DEBUG", z.boolean(), { fallback: false });
    }
    get isLogging() {
        return env.get("LOGGING", z.boolean(), { fallback: false });
    }
}
