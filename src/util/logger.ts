import pino from 'pino';

export const logger = pino(
	process.env.NODE_ENV === 'development'
		? { prettyPrint: { colorize: true, translateTime: true }, name: 'archive_utility_dev', level: 'trace' }
		: { name: 'archive_utility' },
);
