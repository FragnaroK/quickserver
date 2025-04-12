import { Logger } from "pino";
type LoggerType = "middleware" | "internal";
interface Log extends Logger<never, boolean> {
    i: Logger["info"];
    e: Logger["error"];
    d: Logger["debug"] | ((...args: any[]) => void);
    w: Logger["warn"];
    [key: string]: any;
}
declare function createLogger(type: LoggerType, name?: string, debug?: boolean): Log;
declare const isLog: (f: any) => f is Log;
export { isLog };
export type { Log };
export default createLogger;
