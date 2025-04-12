import getEnv from './getEnv.js';
import createLogger, { Log } from './logger.js';
import randomColor from './randomColor.js';
import getColorizedMethod from './textColor.js';
declare const Utils: {
    readonly getEnv: typeof getEnv;
    readonly createLogger: typeof createLogger;
    readonly randomColor: typeof randomColor;
    readonly getColorizedMethod: typeof getColorizedMethod;
    readonly wait: (time?: number) => Promise<unknown>;
};
export type { Log };
export default Utils;
