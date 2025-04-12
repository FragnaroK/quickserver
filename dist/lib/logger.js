import { pino } from "pino";
import pino_pretty from "pino-pretty";
import getColorizedMethod from "./textColor.js";
import _ from "lodash";
const loggerCache = new Map();
function commonPinoOptions(name) {
    return {
        ignore: "pid,hostname",
        customPrettifiers: {
            time: (timestamp) => {
                var _a;
                const now = new Date();
                const brisbaneTime = new Intl.DateTimeFormat("en-AU", {
                    timeZone: "Australia/Brisbane",
                    hour: "numeric",
                    hour12: false,
                }).formatToParts(now);
                const hour = parseInt((_a = brisbaneTime.find((part) => part.type === "hour")) === null || _a === void 0 ? void 0 : _a.value, 10);
                const icon = hour > 5 && hour < 20 ? "🔆" : "🌙";
                return `${icon}`;
            },
            level: (logLevel, key, log, { label, labelColorized, colors }) => {
                const customName = name !== "" ? colors.gray(`[${name}]`) : "";
                const customLabel = labelColorized;
                return `${customName}[${customLabel}]`.trim();
            },
        },
    };
}
const middlewarePinoOptions = {
    messageFormat: (log, messageKey, levelLabel, { colors }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const req = {
            method: (_b = (_a = log === null || log === void 0 ? void 0 : log.req) === null || _a === void 0 ? void 0 : _a.method) !== null && _b !== void 0 ? _b : "",
            url: (_d = (_c = log === null || log === void 0 ? void 0 : log.req) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : "",
            headers: { origin: (_g = (_f = (_e = log === null || log === void 0 ? void 0 : log.req) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f.origin) !== null && _g !== void 0 ? _g : "" },
            remoteAddress: (_j = (_h = log === null || log === void 0 ? void 0 : log.req) === null || _h === void 0 ? void 0 : _h.remoteAddress) !== null && _j !== void 0 ? _j : "",
        };
        const separator = (t) => colors.blueBright(t);
        const requestInfo = `${separator("Requested")} ${req.url}`;
        const clientInfo = `${colors.bold(req.headers.origin)} (${colors.gray(req.remoteAddress)})`;
        return colors.white(`${requestInfo} ${separator("from")} ${clientInfo}`);
    },
    customPrettifiers: Object.assign(Object.assign({}, commonPinoOptions("API").customPrettifiers), { level: (logLevel, key, log, { label, labelColorized, colors }) => {
            var _a, _b;
            return `${colors.gray("[API]")}[${getColorizedMethod(label, (_b = (_a = log === null || log === void 0 ? void 0 : log.req) === null || _a === void 0 ? void 0 : _a.method) !== null && _b !== void 0 ? _b : "", colors)}]`;
        } }),
};
function createLogger(type, name = "", debug = false) {
    const key = `${type}-${name}-${debug}`;
    if (loggerCache.has(key)) {
        return loggerCache.get(key);
    }
    const logger = pino({
        level: debug ? "debug" : "info",
    }, pino_pretty(Object.assign(Object.assign({ hideObject: !debug }, commonPinoOptions(name !== null && name !== void 0 ? name : "")), (type === "middleware" ? middlewarePinoOptions : {}))));
    const loggerExtended = logger;
    loggerExtended.i = logger.info;
    loggerExtended.e = logger.error;
    loggerExtended.d = debug ? logger.debug : (...args) => { };
    loggerExtended.w = logger.warn;
    loggerCache.set(key, loggerExtended);
    if (debug && type === "internal")
        loggerExtended.d("Logger created with debug enabled");
    return loggerExtended;
}
const isLog = (f) => {
    if (!_.isObject(f))
        return false;
    const keys = Object.keys(f);
    return (keys.includes("e") &&
        keys.includes("i") &&
        keys.includes("error") &&
        keys.includes("info"));
};
export { isLog };
export default createLogger;
