import HttpStatus from "http-status-values";
export type ObjectType<Data = any> = {
    [key: string]: Data;
};
export type IStatusCode = keyof typeof HttpStatus;
