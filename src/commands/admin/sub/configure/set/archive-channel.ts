import { hasuraClient } from '#hasura';
import { ArgumentsOf, list } from '#util';
import { inlineCode } from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import type { data } from '../../../config';

export async function archiveChannel(
	interaction: CommandInteraction<'cached'>,
	{ channel }: ArgumentsOf<typeof data>['set']['archive-channel'],
) {
	await hasuraClient.UpsertServer({ id: interaction.guildId });

	const update = (archive_id: string | null = null) =>
		hasuraClient.UpdateArchiveChannel({ server_id: interaction.guildId, archive_id });

	if (!channel) {
		await update(null);
		return interaction.editReply(`Successfully removed the configured archive channel.`);
	}

	if (!channel.isText()) return interaction.editReply(`${channel.toString()} must be a text channel!`);
	if (
		!channel
			.permissionsFor(interaction.client.user!.id)
			?.has([
				Permissions.FLAGS.VIEW_CHANNEL,
				Permissions.FLAGS.READ_MESSAGE_HISTORY,
				Permissions.FLAGS.SEND_MESSAGES,
				Permissions.FLAGS.ATTACH_FILES,
				Permissions.FLAGS.EMBED_LINKS,
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
