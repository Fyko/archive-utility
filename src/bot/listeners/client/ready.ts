import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			category: 'client',
			emitter: 'client',
			event: 'ready',
		});
	}

	public async exec(): Promise<void> {
		this.client.logger.info(`[READY] ${this.client.user!.tag} is ready to host some giveaways.`);
		void this.client.archiveAPI.init();

		for (const id of this.client.guilds.cache.keys()) {
			const existing = this.client.settings.cache.guilds.get(id);
			if (!existing) await this.client.settings.new('guild', { id });
		}

		await this.client.user?.setActivity(`arch!info - fyko.net/archive-util`, { type: 'WATCHING' });

		setInterval(() => this._clearPresences(), 9e5);

		setInterval(() => {
			const userCount = this.client.guilds.cache.reduce((acc, g): number => (acc = Number(g.memberCount)), 0);
			this.client.prometheus.userHistogram.set(userCount);
			this.client.prometheus.guildHistogram.set(this.client.guilds.cache.size);
		}, 1000 * 15);
	}

	private _clearPresences(): void {
		const i = this.client.guilds.cache.reduce((acc: number, g: Guild): number => {
			acc += g.presences.cache.size;
			g.presences.cache.clear();
			return acc;
		}, 0);
		this.client.emit('debug', `[PRESNCES]: Swept ${i} presences in ${this.client.guilds.cache.size} guilds.`);
	}
}
