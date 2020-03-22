import { Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

export default class ArchiveChannelCommand extends Command {
	public constructor() {
		super('archive-channel', {
			category: 'admin',
			channel: 'guild',
			aliases: ['set-archive', 'sa'],
			args: [
				{
					id: 'channel',
					type: 'textChannel',
					prompt: {
						start: 'What channel would you like to post the archived-channel viewing links to?',
						retry: 'Please provide a valid text channel for me to post archived-channel viewing links to.',
						optional: true,
					},
				},
			],
			userPermissions: ['MANAGE_CHANNELS'],
			description: {
				content: 'Sets the channel where archived-channel viewing links will be posted to.',
				usage: '<channel>',
				examples: ['#archived-releases'],
			},
		});
	}

	public async exec(msg: Message, { channel }: { channel: TextChannel }): Promise<Message | Message[] | void> {
		const guild = this.client.settings.guild.find(g => g.id === msg.guild?.id);
		if (!channel) {
			if (guild?.archive && this.client.channels.get(guild.archive))
				return msg.util?.reply(
					`archived-channel viewing links are being posted in ${this.client.channels.get(guild.archive)}.`,
				);
			return msg.util?.reply('there is no current archived-channel channel.');
		}

		await this.client.settings.set('guild', { id: msg.guild?.id }, { archive: channel.id });
		return msg.util?.reply(`successfully set the archived-channel log to ${channel}.`);
	}
}
