import { Logger, pino } from "pino";
import pino_pretty from "pino-pretty";
import getColorizedMethod from "./textColor.js";
import _ from "lodash";

type LoggerType = "middleware" | "internal";
interface Log extends Logger<never, boolean> {
	i: Logger["info"];
	e: Logger["error"];
	d: Logger["debug"] | ((...args: any[]) => void);
	w: Logger["warn"];
	[key: string]: any;
}

const loggerCache = new Map<string, Log>();

function commonPinoOptions(name: string): pino_pretty.PrettyOptions {
	return {
		ignore: "pid,hostname",
		// @ts-ignore
		customPrettifiers: {
			time: (timestamp) => {
				const now = new Date();
				const brisbaneTime = new Intl.DateTimeFormat("en-AU", {
					timeZone: "Australia/Brisbane",
					hour: "numeric",
					hour12: false,
				}).formatToParts(now);

				const hour = parseInt(
					brisbaneTime.find((part) => part.type === "hour")?.value!,
					10,
				);
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

const middlewarePinoOptions: pino_pretty.PrettyOptions = {
	messageFormat: (log: any, messageKey, levelLabel, { colors }) => {
		const req = {
			method: log?.req?.method ?? "",
			url: log?.req?.url ?? "",
			headers: { origin: log?.req?.headers?.origin ?? "" },
			remoteAddress: log?.req?.remoteAddress ?? "",
		};

		const separator = (t: string) => colors.blueBright(t);
		const requestInfo = `${separator("Requested")} ${req.url}`;
		const clientInfo = `${colors.bold(req.headers.origin)} (${colors.gray(
			req.remoteAddress,
		)})`;

		return colors.white(`${requestInfo} ${separator("from")} ${clientInfo}`);
	},
	// @ts-ignore
	customPrettifiers: {
		...commonPinoOptions("API").customPrettifiers,
		level: (logLevel, key, log, { label, labelColorized, colors }) =>
			`${colors.gray("[API]")}[${getColorizedMethod(
				label,
				(log as any)?.req?.method ?? "",
				colors,
			)}]`,
	},
};

function createLogger(type: LoggerType, name: string = "", debug: boolean = false): Log {
	const key = `${type}-${name}-${debug}`;

	if (loggerCache.has(key)) {
		return loggerCache.get(key)!;
	}

	const logger = pino(
		{
			level: debug ? "debug" : "info",
		},
		pino_pretty({
			hideObject: !debug,
			...commonPinoOptions(name ?? ""),
			...(type === "middleware" ? middlewarePinoOptions : {}),
		}),
	);

	const loggerExtended = logger as Log;

	loggerExtended.i = logger.info;
	loggerExtended.e = logger.error;
	loggerExtended.d = debug ? logger.debug : (...args: any[]) => {};
	loggerExtended.w = logger.warn;

	loggerCache.set(key, loggerExtended);

	if (debug && type === "internal")
		loggerExtended.d("Logger created with debug enabled");
	// console.log(logger, loggerExtended, loggerCache);

	return loggerExtended;
}

const isLog = (f: any): f is Log => {
	if (!_.isObject(f)) return false;
	const keys = Object.keys(f);
	return (
		keys.includes("e") &&
		keys.includes("i") &&
		keys.includes("error") &&
		keys.includes("info")
	);
};

export { isLog };
export type { Log };
export default createLogger;
