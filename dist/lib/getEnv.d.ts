export default function getEnv<T = string>(name: string, value?: string, opt?: {
    fallback?: T;
    required?: boolean;
}): T;
