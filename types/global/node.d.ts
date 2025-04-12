export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			LOGGING: string;
			DEBUG: string;
		}
	}
}

