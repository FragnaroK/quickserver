export default function getColorizedMethod(type, method, colors) {
    if (method === null || method === undefined)
        return null;
    switch (type) {
        case 'INFO':
            return colors.blueBright(method);
        case 'ERROR':
            return colors.redBright(method);
        case 'WARN':
            return colors.yellowBright(method);
        case 'DEBUG':
            return colors.greenBright(method);
        default:
            return null;
    }
}
