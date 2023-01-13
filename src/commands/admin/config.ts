import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { ChannelType } from 'discord.js';
import type { CommandInteraction  } from 'discord.js';
import { set } from './sub/configure/set/index.js';
import { show } from './sub/configure/show.js';
import type { Command } from '#structs';
import type { ArgumentsOf } from '#util';

export const data = {
	name: 'configure',
	description: "Configure the bot's settings.",
	options: [
		{
			name: 'show',
			description: "Displays the bot's current configuration",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'set',
			description: 'Update bot settings.',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'archive-channel',
					description: 'Sets the archive channel -- where channel archives are posted.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'channel',
							description: 'Which channel to set as the new archive channel.',
							type: ApplicationCommandOptionType.Channel,
							channel_types: [ChannelType.GuildText],
							required: false,
						},
					],
				},
			],
		},
	],
} as const;

// TODO: i18n
export default class implements Command {
	public readonly data = data;

	public async exec(interaction: CommandInteraction<'cached'>, args: ArgumentsOf<typeof data>) {
		await interaction.deferReply({ ephemeral: true });

		switch (Object.keys(args)[0]) {
			case 'show': {
				return show(interaction);
			}

			case 'set': {
				return set(interaction, args.set);
			}
		}
	}
}
