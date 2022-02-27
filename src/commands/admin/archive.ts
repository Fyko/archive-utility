import { hasuraClient } from '#hasura';
import { logger } from '#logger';
import { Command, ExportFormatExtensions } from '#structs';
import { ArgumentsOf, Colors, displayHTML, kExportHandler } from '#util';
import { ApplicationCommandOptionType, ChannelType } from 'discord-api-types/v9';
import { CommandInteraction, GuildMember, MessageEmbed, Permissions } from 'discord.js';
import { time } from '@discordjs/builders';
import i18next from 'i18next';
import { inject, injectable } from 'tsyringe';
import { ExporterClient } from '@fyko/export-api/client';
import { CreateExportRequest, CreateExportResponse, ExportFormat } from '@fyko/export-api/types';

const data = {
	name: 'archive',
	description: 'Archives a channel.',
	options: [
		{
			name: 'channel',
			description: 'The channel to archive.',
			type: ApplicationCommandOptionType.Channel,
			channel_types: [ChannelType.GuildText],
			required: true,
		},
		{
			name: 'cleanup',
			description: 'Whether or not to delete the channel after creating an archive (default: false)',
			type: ApplicationCommandOptionType.Boolean,
		},
		{
			name: 'archive',
			description: 'The channel to post the archive in, overrides the configured archive channel.',
			type: ApplicationCommandOptionType.Channel,
			channel_types: [ChannelType.GuildText],
		},
		{
			name: 'format',
			description: 'The format to export the channel to (default: dark mode)',
			type: ApplicationCommandOptionType.Integer,
			choices: [
				{
					name: 'Dark Mode',
					value: ExportFormat.HTMLDARK,
				},
				{
					name: 'Light Mode',
					value: ExportFormat.HTMLLIGHT,
				},
				{
					name: 'Plain Text (TXT)',
					value: ExportFormat.PLAINTEXT,
				},
				{
					name: 'CSV',
					value: ExportFormat.CSV,
				},
				{
					name: 'JSON',
					value: ExportFormat.JSON,
				},
			],
		},
	],
} as const;

@injectable()
export default class implements Command {
	public constructor(@inject(kExportHandler) public readonly exportHandler: ExporterClient) {}

	public readonly data = data;

	public async exec(
		interaction: CommandInteraction,
		{ channel, cleanup, format, archive }: ArgumentsOf<typeof data>,
		locale: string,
	) {
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

		const archiveChannel =
			archive ?? (await interaction.guild?.channels.fetch(settings.archive_channel).catch(() => null));

		if (!archiveChannel?.isText()) {
			return interaction.reply({
				content: i18next.t('commands.archive.archive_channel_deleted', { lng: locale }),
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

		if (!channel.deletable || !channel.isText())
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

		const request = new CreateExportRequest();
		request.setToken(interaction.client.token!);
		request.setChannelId(channel.id);
		request.setExportFormat(format ?? ExportFormat.HTMLDARK);

		const stream = this.exportHandler.createExport(request);

		const handleProgressChange = (progress: number) => {
			return interaction.editReply(
				i18next.t('commands.archive.progress', {
					lng: locale,
					progress: (progress * 100).toFixed(),
				}),
			);
		};

		let attachment = Buffer.from('', 'base64');
		let messageCount = 0;
		await new Promise((resolve, reject) => {
			let progress = 0;

			const progressInterval = setInterval(() => {
				void handleProgressChange(progress);
			}, 3000);

			stream.on('data', (response: CreateExportResponse) => {
				const p = response.getProgress();
				if (p && p > progress) {
					progress = p;

					if (progress === 1) {
						clearInterval(progressInterval);
						void interaction.editReply(
							i18next.t('commands.archive.created', {
								lng: locale,
								channel: archiveChannel.toString(),
							}),
						);
					}
				}

				const data = response.getData();
				const inner = data?.getData();
				if (inner && inner instanceof Uint8Array) {
					attachment = Buffer.concat([attachment, Buffer.from(inner)]);
				}

				const _messageCount = data?.getMessageCount();
				if (_messageCount) messageCount = _messageCount;
			});

			stream.on('end', () => {
				clearInterval(progressInterval);
				return resolve(void 0);
			});

			stream.on('error', reject);
		});

		const firstMessage = (await channel.messages.fetch({ limit: 1, after: channel.id })).first();
		const lastMessage = (await channel.messages.fetch({ limit: 1 })).first();

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
					joinArrays: '\n',
					channel_age: time(channel.createdAt, 'R'),
					message_count: messageCount.toLocaleString(),
					first_message_long: time(firstMessage!.createdAt),
					first_message_relative: time(firstMessage!.createdAt, 'R'),
					last_message_long: time(lastMessage!.createdAt),
					last_message_relative: time(lastMessage!.createdAt, 'R'),
				}),
			);

		const ext = ExportFormatExtensions[format ?? ExportFormat.HTMLDARK];
		const sent = await archiveChannel.send({
			embeds: [embed],
			files: [
				{
					attachment,
					name: `${channel.name}.${ext}`,
				},
			],
		});

		await sent.edit({
			embeds: [
				embed.addField(
					i18next.t('commands.archive.embeds.log.edit.actions_title', { lng: locale }),
					i18next.t('commands.archive.embeds.log.edit.actions_content', {
						context: ext === 'html' ? '' : 'non_html',
						lng: locale,
						display_html: displayHTML(sent.attachments.first()!.url),
						download_link: sent.attachments.first()?.url,
					}),
				),
			],
		});

		const archiveRecord = await hasuraClient.CreateArchive({
			options: {
				channel_id: archiveChannel.id,
				channel_name: archiveChannel.id,
				performed_by: interaction.user.id,
				server_id: interaction.guildId,
				message_count: messageCount,
			},
		});
		logger.debug(archiveRecord);

		if (cleanup === true) setTimeout(() => void channel.delete(), 5000);

		return interaction.editReply(
			i18next.t('commands.archive.done', {
				lng: locale,
				channel: channel.name,
				sent_url: sent.url,
			}),
		);
	}
}
