import type { APIMessage } from 'discord-api-types/v9';
import type { CommandInteraction, Message } from 'discord.js';
import type { data } from '../../../config.js';
import { archiveChannel } from './archive-channel.js';
import type { ArgumentsOf } from '#util';

export async function set(
	interaction: CommandInteraction<'cached'>,
	args: ArgumentsOf<typeof data>['set'],
): Promise<APIMessage | Message | undefined> {
	switch (Object.keys(args)[0]) {
		case 'archive-channel': {
			return archiveChannel(interaction, args['archive-channel']);
		}
	}
}
