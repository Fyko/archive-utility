import { inlineCode } from '@discordjs/builders';
import type { CommandInteraction} from 'discord.js';
import { PermissionsBitField } from 'discord.js';
import type { Sql } from 'postgres';
import { container } from 'tsyringe';
import type { data } from '../../../config.js';
import { kSQL, list } from '#util';
import type { ArgumentsOf} from '#util';
import type { ServerSettings } from '#util/db';

export async function archiveChannel(
	interaction: CommandInteraction<'cached'>,
	{ channel }: ArgumentsOf<typeof data>['set']['archive-channel'],
) {
	const sql = container.resolve<Sql>(kSQL);

	const _settings = await sql<ServerSettings[]>`
		select * from "archive_utility"."server" where id = ${interaction.guildId}
	`;
	let settings = _settings.count ? _settings[0] : null;

	if (!settings) {
		const upsert = await sql<ServerSettings[]>`
			insert into "archive_utility"."server" (id) values (${interaction.guildId})
			returning *;
		`;
		settings = upsert[0];
	}

	const update = (archive_id: string | null = null) => sql`
		update "archive_utility"."server" set archive_channel = ${archive_id} where id = ${interaction.guildId}
	`;

	if (!channel) {
		await update(null);
		return interaction.editReply(`Successfully removed the configured archive channel.`);
	}

	if (!channel.isTextBased()) return interaction.editReply(`${channel.toString()} must be a text channel!`);
	if (
		!channel
			.permissionsFor(interaction.client.user!.id)
			?.has([
				PermissionsBitField.Flags.ViewChannel,
				PermissionsBitField.Flags.ReadMessageHistory,
				PermissionsBitField.Flags.SendMessages,
				PermissionsBitField.Flags.AttachFiles,
				PermissionsBitField.Flags.EmbedLinks,
			])
	)
		return interaction.editReply(
			`I don't have the correct permissions in ${channel.toString()}! Please ensure I have ${list(
				['View Channel', 'Read Message History', 'Send Messages', 'Attach Files', 'Embed Links'].map(inlineCode),
			)}!`,
		);

	await update(channel.id);
	return interaction.editReply(`Successfully set the new archive channel to ${channel.toString()}.`);
}
