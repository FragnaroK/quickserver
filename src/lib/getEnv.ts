import AppError from "@Class/error.js";

const parseValueType = (value: unknown): string | number | boolean | object => {
    switch (typeof value) {
        case 'string':
            return String(value);
        case 'number':
            return Number(value);
        case 'boolean':
            return Boolean(value);
        case 'object':
            return JSON.parse(JSON.stringify(value)) ?? {};
        case 'symbol':
            return String(value);
        case 'bigint':
            return Number(value);
        case 'function':
            return String(value);
        default:
            return '';
    }
}

export default function getEnv<T = string>(name: string, value?: string, opt?: { fallback?: T, required?: boolean }): T {
    const { fallback, required } = opt || {};

    if (!name) {
        throw new Error('getEnv: Env variable name is required');
    }

    if (!value) {
        if (required) throw new AppError('ENV_NOT_FOUND', 'INTERNAL_SERVER_ERROR', `Env variable "${name}" is required`);
        const parsedFallback = parseValueType(fallback);
        return parsedFallback as unknown as T;
    }

    const parsedValue = parseValueType(value);

    return parsedValue as unknown as T;
}
