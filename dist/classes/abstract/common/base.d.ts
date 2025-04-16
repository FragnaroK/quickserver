export default abstract class Base {
    protected static get isTest(): boolean;
    protected static get isProd(): boolean;
    protected static get isDev(): boolean;
    protected static get isDebug(): boolean;
    protected static get isLogging(): boolean;
    protected get isTest(): boolean;
    protected get isProd(): boolean;
    protected get isDev(): boolean;
    protected get isDebug(): boolean;
    protected get isLogging(): boolean;
}
