import { Colorette } from 'colorette';

export default function getColorizedMethod(type: string, method: string | null | undefined, colors: Colorette) {
    if (method === null || method === undefined) return null;
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
