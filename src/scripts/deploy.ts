import process from 'node:process';
import { REST } from '@discordjs/rest';
import type { RESTPutAPIApplicationCommandsResult} from 'discord-api-types/v9';
import { Routes } from 'discord-api-types/v9';
import { logger } from '#logger';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

export async function deploy(data: any, dev = false) {
	const midRoute = dev ? Routes.guild(process.env.DISCORD_DEVGUILD_ID!) : '';
	const route = `/applications/${process.env.DISCORD_CLIENT_ID as string}${midRoute}/commands` as `/${string}`;

	try {
		logger.info(`Starting update @ ${route}`);
		const res = (await rest.put(route, { body: data })) as RESTPutAPIApplicationCommandsResult;
		logger.info(res);
		logger.info('Update completed');
	} catch (error) {
		logger.info('Request failed:');
		logger.error(error);
	}
}
