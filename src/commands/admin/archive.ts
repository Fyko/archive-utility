import { Buffer } from 'node:buffer';
import { clearInterval, setInterval, setTimeout } from 'node:timers';
import { time } from '@discordjs/builders';
import { ExporterClient } from '@fyko/export-api/client';
import { CreateExportRequest, type CreateExportResponse, ExportFormat } from '@fyko/export-api/types';
import { ApplicationCommandOptionType, ChannelType } from 'discord-api-types/v9';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import type { GuildMember, ChatInputCommandInteraction } from 'discord.js';
import i18next from 'i18next';
import { Sql } from 'postgres';
import { inject, injectable } from 'tsyringe';
import { logger } from '#logger';
import type { Command } from '#structs';
import { Colors, displayHTML, kExportClient, kSQL } from '#util';
import type { ArgumentsOf} from '#util';
import type { ArchiveRecord, ServerSettings } from '#util/db';

export const ExportFormatExtensions = {
	[ExportFormat.PLAINTEXT]: 'txt',
	[ExportFormat.HTMLDARK]: 'html',
	[ExportFormat.HTMLLIGHT]: 'html',
	[ExportFormat.CSV]: 'csv',
	[ExportFormat.JSON]: 'json',
} as const;

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
	public constructor(
		@inject(kExportClient) public readonly exportHandler: ExporterClient,
		@inject(kSQL) public readonly sql: Sql,
	) {}

	public readonly data = data;

	public async exec(
		interaction: ChatInputCommandInteraction<'cached'>,
		{ channel, cleanup, format, archive }: ArgumentsOf<typeof data>,
		locale: string,
	) {
		if (!(interaction.member as GuildMember).permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({
				content: i18next.t('commands.archive.perms.user.no_perms', { lng: locale, channel: channel.toString() })!,
				ephemeral: true,
			});
		}

		// fetch the guild settings and if it doesnt exist, create a new one
		const _settings = await this.sql<ServerSettings[]>`
			select * from "archive_utility"."server" where id = ${interaction.guildId}
		`;
		const settings = _settings.count ? _settings[0] : null;

		if (!settings) {
			await this.sql`
				insert into "archive_utility"."server" (id) values (${interaction.guildId})
			`;
		}

		if (!settings?.archive_channel) {
			return interaction.reply({
				content: i18next.t('commands.archive.no_archive_channel', { lng: locale })!,
				ephemeral: true,
			});
		}

		const archiveChannel =
			archive ?? (await interaction.guild?.channels.fetch(settings.archive_channel).catch(() => null));

		if (!archiveChannel?.isTextBased()) {
			return interaction.reply({
				content: i18next.t('commands.archive.archive_channel_deleted', { lng: locale })!,
				ephemeral: true,
			});
		}

		if (
			!archiveChannel
				.permissionsFor(interaction.client.user!.id)
				?.has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles])
		) {
			return interaction.reply({
				content: i18next.t('commands.archive.perms.client.cant_send_archive', {
					lng: locale,
					channel: channel.toString(),
				})!,
				ephemeral: true,
			});
		}

		if (!channel.deletable || !channel.isTextBased())
			return interaction.reply({
				content: i18next.t('commands.archive.perms.client.cant_delete', {
					lng: locale,
					channel: channel.toString(),
				})!,
				ephemeral: true,
			});

		await interaction.reply(
			i18next.t('commands.archive.creating', {
				lng: locale,
			})!,
		);

		const request = new CreateExportRequest();
		request.setToken(interaction.client.token!);
		request.setChannelId(channel.id);
		request.setExportFormat(format ?? ExportFormat.HTMLDARK);

		const stream = this.exportHandler.createExport(request);

		const handleProgressChange = async (progress: number) => {
			return interaction.editReply(
				i18next.t('commands.archive.progress', {
					lng: locale,
					progress: progress.toFixed(2),
				})!,
			);
		};

		let attachment = Buffer.from('', 'base64');
		let messageCount = 0;
		await new Promise((resolve, reject) => {
			let progress = 0;

			const progressInterval = setInterval(() => {
				void handleProgressChange(progress);
			}, 2_000);

			stream.on('data', (response: CreateExportResponse) => {
				const progressRes = response.getProgress();
				if (progressRes && progressRes > progress) {
					progress = progressRes;

					if (progress === 1) {
						clearInterval(progressInterval);
						void interaction.editReply(
							i18next.t('commands.archive.created', {
								lng: locale,
								channel: archiveChannel.toString(),
							})!,
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
				resolve(void 0);
			});

			stream.on('error', reject);
		});

		const firstMessage = (await channel.messages.fetch({ limit: 1, after: channel.id })).first();
		const lastMessage = (await channel.messages.fetch({ limit: 1 })).first();

		const embed = new EmbedBuilder()
			.setColor(interaction.guild?.members?.me?.displayColor ?? Colors.Primary)
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
				iconURL: interaction.user.displayAvatarURL({ size: 2_048 }),
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
				embed.addFields(
					{ name: i18next.t('commands.archive.embeds.log.edit.actions_title', { lng: locale }),
					 value: i18next.t('commands.archive.embeds.log.edit.actions_content', {
						context: ext === 'html' ? '' : 'non_html',
						lng: locale,
						display_html: displayHTML(sent.attachments.first()!.url),
						download_link: sent.attachments.first()?.url,
					})},
				),
			],
		});

		// create archive record
		const record = (
			await this.sql<ArchiveRecord[]>`
			insert into "archive_utility"."archive" ("channel_id", "channel_name", "performed_by", "server_id", "message_count")
			values (${archiveChannel.id}, ${archiveChannel.name}, ${interaction.user.id}, ${interaction.guildId}, ${messageCount})
			returning *;
		`
		)[0];
		logger.debug(record);

		if (cleanup === true) setTimeout(() => void channel.delete(), 5_000);

		return interaction.editReply(
			i18next.t('commands.archive.done', {
				lng: locale,
				channel: channel.name,
				sent_url: sent.url,
			})!,
		);
	}
}
