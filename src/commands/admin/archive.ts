import { hasuraClient } from '#hasura';
import type { Command, ExportHandler } from '#structs';
import { ArgumentsOf, Colors, displayHTML, kExportHandler } from '#util';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { CommandInteraction, GuildMember, MessageEmbed, Permissions } from 'discord.js';
import i18next from 'i18next';
import { inject, injectable } from 'tsyringe';

const data = {
	name: 'archive',
	description: 'Archives a channel.',
	options: [
		{
			name: 'channel',
			description: 'The channel to archive.',
			type: ApplicationCommandOptionType.Channel,
			required: true,
		},
	],
} as const;

@injectable()
export default class implements Command {
	public constructor(@inject(kExportHandler) public readonly exportHandler: ExportHandler) {}

	public readonly data = data;

	public async exec(interaction: CommandInteraction, { channel }: ArgumentsOf<typeof data>, locale: string) {
		if (!interaction.inGuild())
			return interaction.reply({ content: i18next.t('common.errors.guild_only_command', { lng: locale }) });

		if (!(interaction.member as GuildMember).permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return interaction.reply({
				content: i18next.t('commands.archive.perms.user.no_perms', { lng: locale, channel: channel.toString() }),
				ephemeral: true,
			});
		}

		const { insert_archive_utility_server } = await hasuraClient.UpsertServer({ id: interaction.guildId });
		const settings = insert_archive_utility_server?.returning[0];

		if (!settings?.archive_channel) {
			return interaction.reply({
				content: i18next.t('commands.archive.no_archive_channel', { lng: locale }),
				ephemeral: true,
			});
		}

		const archiveChannel = await interaction.guild?.channels.fetch(settings?.archive_channel).catch(() => null);
		if (!archiveChannel || !archiveChannel.isText()) {
			return interaction.reply({
				content: i18next.t('commands.archive.archive_channel_deleted', { lng: locale }),
				ephemeral: true,
			});
		}

		if (!channel.isText()) {
			return interaction.reply({
				content: i18next.t('commands.archive.only_archive_text', { lng: locale }),
				ephemeral: true,
			});
		}

		if (
			!archiveChannel
				.permissionsFor(interaction.client.user!.id)
				?.has([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES])
		) {
			return interaction.reply({
				content: i18next.t('commands.archive.perms.client.cant_send_archive', {
					lng: locale,
					channel: channel.toString(),
				}),
				ephemeral: true,
			});
		}

		if (!channel.deletable)
			return interaction.reply({
				content: i18next.t('commands.archive.perms.client.cant_delete', {
					lng: locale,
					channel: channel.toString(),
				}),
				ephemeral: true,
			});

		await interaction.reply(
			i18next.t('commands.archive.creating', {
				lng: locale,
			}),
		);
		const attachment = await this.exportHandler.createLog(channel.id);

		await interaction.editReply(
			i18next.t('commands.archive.created', {
				lng: locale,
				channel: archiveChannel.toString(),
			}),
		);

		const embed = new MessageEmbed()
			.setColor(interaction.guild?.me?.displayColor ?? Colors.Primary)
			.setTimestamp()
			.setTitle(
				i18next.t('commands.archive.embeds.log.title', {
					lng: locale,
				}),
			)
			.setAuthor({
				name: i18next.t('commands.archive.embeds.log.author.name', {
					lng: locale,
					user: interaction.user.tag,
				}),
				iconURL: interaction.user.displayAvatarURL({ size: 2048 }),
			})
			.setDescription(
				i18next.t('commands.archive.embeds.log.description', {
					lng: locale,
					channel: channel.name,
				}),
			);

		const sent = await archiveChannel.send({
			embeds: [embed],
			files: [
				{
					attachment,
					name: `${channel.name}.html`,
				},
			],
		});

		await interaction.editReply(
			i18next.t('commands.archive.created_wrapup', { lng: locale, channel: archiveChannel.toString() }),
		);

		await sent.edit({
			embeds: [
				embed.addField(
					i18next.t('commands.archive.embeds.log.edit.actions_title', { lng: locale }),
					i18next.t('commands.archive.embeds.log.edit.actions_content', {
						lng: locale,
						display_html: displayHTML(sent.attachments.first()!.url),
						download_link: sent.attachments.first()?.url,
					}),
				),
			],
		});

		await hasuraClient.CreateArchive({
			options: {
				channel_id: archiveChannel.id,
				channel_name: archiveChannel.id,
				performed_by: interaction.user.id,
				server_id: interaction.guildId,
			},
		});

		setTimeout(() => void channel.delete(), 5000);

		return interaction.editReply(
			i18next.t('commands.archive.done', { lng: locale, channel: channel.name, sent_url: sent.url }),
		);
	}
}
