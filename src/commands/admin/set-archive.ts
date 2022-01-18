import type { Command } from '#structs';
import type { ArgumentsOf } from '#util';
import { channelMention } from '@discordjs/builders';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { CommandInteraction, GuildMember, Permissions } from 'discord.js';
import { hasuraClient } from '#hasura';
import i18next from 'i18next';

const data = {
	name: 'set-archive',
	description: 'Sets the channel where channel exports should be posted.',
	options: [
		{
			name: 'channel',
			description: 'The channel to post channel exports to.',
			type: ApplicationCommandOptionType.Channel,
		},
	],
} as const;

export default class implements Command {
	public readonly data = data;

	public async exec(interaction: CommandInteraction, { channel }: ArgumentsOf<typeof data>, locale: string) {
		if (!interaction.inGuild())
			return interaction.reply({ content: i18next.t('common.errors.guild_only_command', { lng: locale }) });

		if (!(interaction.member as GuildMember).permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return interaction.reply({
				content: i18next.t('commands.set_archive.perms.user.cant_set', {
					lng: locale,
				}),
				ephemeral: true,
			});
		}

		const { insert_archive_utility_server } = await hasuraClient.UpsertServer({ id: interaction.guildId });
		const settings = insert_archive_utility_server?.returning[0];

		if (!channel) {
			if (settings?.archive_channel)
				return interaction.reply(
					i18next.t('commands.set_archive.currently_set', {
						lng: locale,
						channel: channelMention(settings.archive_channel),
					}),
				);
			return interaction.reply(
				i18next.t('commands.set_archive.none_set', {
					lng: locale,
				}),
			);
		}

		if (!channel.isText()) {
			return interaction.reply({
				content: i18next.t('commands.set_archive.errors.text_only', {
					lng: locale,
				}),
				ephemeral: true,
			});
		}

		await hasuraClient.UpdateArchiveChannel({ server_id: interaction.guildId, archive_id: channel.id });
		return interaction.reply(
			i18next.t('commands.set_archive.successfuly_set', {
				lng: locale,
				channel: channel.toString(),
			}),
		);
	}
}
