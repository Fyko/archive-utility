import { Listener } from 'discord-akairo';

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
	}
}
