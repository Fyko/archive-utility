import { logger } from '#logger';
import type { Listener } from '#structs';
import { Client, Constants } from 'discord.js';
import { injectable } from 'tsyringe';

@injectable()
export default class implements Listener {
	public readonly event = Constants.Events.CLIENT_READY;

	public constructor(public readonly client: Client<true>) {}

	public exec = (): void => {
		this.client.on(this.event, () => {
			logger.info(`${this.client.user.tag} (${this.client.user.id}) is ready!`);
		});
	};
}
