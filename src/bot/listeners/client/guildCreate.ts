import { Listener } from 'discord-akairo';
import { Guild, TextChannel, User } from 'discord.js';

export default class GuildCreateListener extends Listener {
	public constructor() {
		super('guildCreate', {
			emitter: 'client',
			event: 'guildCreate',
			category: 'client',
		});
	}

	public async exec(guild: Guild): Promise<void> {
		this.client.logger.info(`[NEW GUILD] Joined a new server! ${guild.name} | ${guild.memberCount} Member(s)`);
		const existing = this.client.settings.guild.get(guild.id);
		if (!existing) {
			await this.client.settings.new('guild', {
				id: guild.id,
			});
		}

		const embed = this.client.util
			.embed()
			.setAuthor(this.client.user?.username, this.client.user?.displayAvatarURL())
			.setDescription(
				`Hey there! I\'m ${
					this.client.user!.username
				}! Thank's for inviting me to your guild. To get more information on how to use me, run \`arch!help\` or \`arch!guide\`.`,
			)
			.setColor(guild.me?.displayColor || this.client.config.color);

		if (guild.me?.hasPermission('VIEW_AUDIT_LOG')) {
			const entries = await guild.fetchAuditLogs({
				type: 28,
			});
			if (entries.entries.size) {
				const theEntry = entries.entries.find(e => (e.target as User).id === this.client.user?.id);
				if (theEntry) {
					try {
						await theEntry.executor.send({ embed });
					} catch {}
				}
			}
		} else {
			const channel = guild.channels.find(
				ch =>
					ch.type === 'text' &&
					ch.permissionsFor(this.client.user!.id)!.has('SEND_MESSAGES') &&
					!ch.name.includes('general') &&
					!ch.name.includes('main') &&
					!ch.name.includes('global'),
			);
			try {
				await (channel as TextChannel).send({ embed });
			} catch {}
		}
	}
}
