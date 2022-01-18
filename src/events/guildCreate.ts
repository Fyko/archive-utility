import { hasuraClient } from '#hasura';
import { logger } from '#logger';
import type { Listener } from '#structs';
import { Colors } from '#util';
import { AuditLogEvent } from 'discord-api-types/v9';
import { Client, Constants, MessageEmbed, Permissions, User } from 'discord.js';
import i18next from 'i18next';
import { injectable } from 'tsyringe';

@injectable()
export default class implements Listener {
	public readonly event = Constants.Events.GUILD_CREATE;

	public constructor(public readonly client: Client<true>) {}

	public exec = (): void => {
		this.client.on(this.event, async (guild) => {
			logger.info(`[NEW GUILD] Joined a new server! ${guild.name} | ${guild.memberCount} Member(s)`);
			const existing = await hasuraClient.GetServerByPk({ id: guild.id });
			if (!existing.archive_utility_server_by_pk) {
				await hasuraClient.CreateServer({ id: guild.id });
			}

			const embed = new MessageEmbed()
				.setAuthor({ name: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
				.setDescription(
					i18next.t('events.guild_create.embeds.invited.description', {
						lng: guild.preferredLocale,
						client_name: this.client.user.username,
					}),
				)
				.setColor(guild.me?.displayColor ?? Colors.Primary);

			if (guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
				const entries = await guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd });

				if (entries.entries.size) {
					const theEntry = entries.entries.find((e) => (e.target as User).id === this.client.user.id);
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
