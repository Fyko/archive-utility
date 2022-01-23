import { hasuraClient } from '#hasura';
import { Colors } from '#util';
import { channelMention } from '@discordjs/builders';
import { stripIndents } from 'common-tags';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export async function show(interaction: CommandInteraction<'cached'>) {
	const { insert_archive_utility_server } = await hasuraClient.UpsertServer({ id: interaction.guildId });
	const settings = insert_archive_utility_server?.returning[0];

	const embed = new MessageEmbed()
		.setColor(interaction.guild.me?.displayColor ?? Colors.Primary)
		.setTitle(`${interaction.guild.name}'s Settings`).setDescription(stripIndents`
			Archive Channel: ${settings?.archive_channel ? channelMention(settings.archive_channel) : 'none set'}
		`);

	return interaction.editReply({ embeds: [embed] });
}
