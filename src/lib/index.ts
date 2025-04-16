import createLogger, { Log } from './logger.js';
import randomColor from './randomColor.js';
import getColorizedMethod from './textColor.js';
import wait from './wait.js';


const Utils = {
    createLogger,
    randomColor,
    getColorizedMethod,
    wait,
} as const;

export type { Log };
export default Utils;