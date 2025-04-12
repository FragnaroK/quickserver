import AppError from "@Class/error.js";
const parseValueType = (value) => {
    var _a;
    switch (typeof value) {
        case 'string':
            return String(value);
        case 'number':
            return Number(value);
        case 'boolean':
            return Boolean(value);
        case 'object':
            return (_a = JSON.parse(JSON.stringify(value))) !== null && _a !== void 0 ? _a : {};
        case 'symbol':
            return String(value);
        case 'bigint':
            return Number(value);
        case 'function':
            return String(value);
        default:
            return '';
    }
};
export default function getEnv(name, value, opt) {
    const { fallback, required } = opt || {};
    if (!name) {
        throw new Error('getEnv: Env variable name is required');
    }
    if (!value) {
        if (required)
            throw new AppError('ENV_NOT_FOUND', 'INTERNAL_SERVER_ERROR', `Env variable "${name}" is required`);
        const parsedFallback = parseValueType(fallback);
        return parsedFallback;
    }
    const parsedValue = parseValueType(value);
    return parsedValue;
}
