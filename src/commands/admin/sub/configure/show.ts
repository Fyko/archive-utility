import { channelMention } from '@discordjs/builders';
import { stripIndents } from 'common-tags';
import type { CommandInteraction} from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import type { Sql } from 'postgres';
import { container } from 'tsyringe';
import { Colors, kSQL } from '#util';
import type { ServerSettings } from '#util/db';

export async function show(interaction: CommandInteraction<'cached'>) {
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

	const embed = new EmbedBuilder()
		.setColor(interaction.guild.members.me?.displayColor ?? Colors.Primary)
		.setTitle(`${interaction.guild.name}'s Settings`).setDescription(stripIndents`
			Archive Channel: ${settings.archive_channel ? channelMention(settings.archive_channel) : 'none set'}
		`);

	return interaction.editReply({ embeds: [embed] });
}
