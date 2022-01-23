import { Command } from '#structs';
import { ArgumentsOf } from '#util';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { CommandInteraction } from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';
import { set } from './sub/configure/set';
import { show } from './sub/configure/show';

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
							channel_types: [ChannelTypes.GUILD_TEXT],
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
