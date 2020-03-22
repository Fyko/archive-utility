export const SENSITIVE_PATTERN_REPLACEMENT = '[REDACTED]';

export const MESSAGES = {
	COMMANDS: {
		EVAL: {
			LONG_OUTPUT: (link: string): string => `Output too long, uploading it to hastebin instead: ${link}.`,
			INPUT: (code: string): string => `Input:\`\`\`js\n${code}\n\`\`\``,
			OUTPUT: (code: string): string => `Output:\`\`\`js\n${code}\n\`\`\``,
			TYPE: ``,
			TIME: ``,
			HASTEBIN: ``,
			ERRORS: {
				TOO_LONG: `Output too long, failed to upload to hastebin as well.`,
				CODE_BLOCK: (err: Error): string => `Error:\`\`\`xl\n${err}\n\`\`\``,
			},
		},
	},
};

export const MONGO_EVENTS = {
	connecting: 'Connecting to MongoDB...',
	connected: 'Successfully connected to MongoDB.',
	disconnecting: 'Disconnecting from MongoDB...',
	disconnected: 'Disconnected from MongoDB...',
	close: 'MongoDB connection closed.',
	reconnected: 'Successfully reconnected to MongoDB.',
} as { [key: string]: string };

export const LoggerConfig = {
	levels: {
		error: 0,
		debug: 1,
		warn: 2,
		data: 3,
		info: 4,
		verbose: 5,
		silly: 6,
		custom: 7,
	},
	colors: {
		error: 'red',
		debug: 'blue',
		warn: 'yellow',
		data: 'grey',
		info: 'green',
		verbose: 'cyan',
		silly: 'magenta',
		custom: 'yellow',
	},
};
