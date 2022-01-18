import pino from 'pino';

export const logger = pino(
	process.env.NODE_ENV === 'development' ? { prettyPrint: { colorize: true, translateTime: true } } : {},
);
