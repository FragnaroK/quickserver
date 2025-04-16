export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			LOGGING: boolean;
			DEBUG: boolean;
		}
	}
}

