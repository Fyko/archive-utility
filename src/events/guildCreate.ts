import { AuditLogEvent } from 'discord-api-types/v9';
import type { User } from 'discord.js';
import { Client, EmbedBuilder, Events, PermissionFlagsBits } from 'discord.js';
import i18next from 'i18next';
import { Sql } from 'postgres';
import { inject, injectable } from 'tsyringe';
import { logger } from '#logger';
import type { Listener } from '#structs';
import { Colors, kSQL } from '#util';

@injectable()
export default class implements Listener {
	public readonly event = Events.GuildCreate;

	public constructor(public readonly client: Client<true>, @inject(kSQL) public readonly sql: Sql) {}

	public exec = (): void => {
		this.client.on(this.event, async (guild) => {
			logger.info(`[NEW GUILD] Joined a new server! ${guild.name} | ${guild.memberCount} Member(s)`);
			const existing = await this.sql`select * from "archive_utility"."server" where id = ${guild.id}`;
			if (!existing.count) {
				await this.sql`
					insert into "archive_utility"."server" (id)
					values (${guild.id});
				`;
			}

			const embed = new EmbedBuilder()
				.setAuthor({ name: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
				.setDescription(
					i18next.t('events.guild_create.embeds.invited.description', {
						lng: guild.preferredLocale,
						client_name: this.client.user.username,
					}),
				)
				.setColor(guild.members.me?.displayColor ?? Colors.Primary);

			if (guild.members.me?.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
				const entries = await guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd });

				if (entries.entries.size) {
					const theEntry = entries.entries.find((entry) => (entry.target as User).id === this.client.user.id);
					if (theEntry) {
						try {
							await theEntry.executor?.send({ embeds: [embed] });
						} catch {}
					}
				}
			}
		});
	};
}
