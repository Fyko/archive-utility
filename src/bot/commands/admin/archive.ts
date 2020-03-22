import { oneLine, stripIndents } from 'common-tags';
import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

export default class ArchiveCommand extends Command {
	public constructor() {
		super('archive', {
			category: 'admin',
			channel: 'guild',
			aliases: ['archive', 'a'],
			args: [
				{
					id: 'channel',
					type: 'textChannel',
					prompt: {
						start: 'What channel do you wish to archive?',
						retry: 'Please provide a valid text channel you want me to archive?',
					},
				},
			],
			userPermissions: ['MANAGE_CHANNELS'],
			description: {
				content: 'Creates an archive of a channel then sends it to the configured archive channel',
				usage: '<channel>',
				examples: ['#archived-releases'],
			},
		});
	}

	public async exec(msg: Message, { channel }: { channel: TextChannel }): Promise<Message | Message[] | void> {
		const guild = this.client.settings.cache.guilds.get(msg.guild!.id);
		const prefix = (this.handler.prefix as PrefixSupplier)(msg);

		if (!guild || !guild?.archive) {
			return msg.util?.reply(`there is no archive-channel set! Please set one with \`${prefix}help set-archive\``);
		}

		const archive = this.client.channels.cache.get(guild.archive);
		if (!archive || !(archive instanceof TextChannel)) {
			return msg.util?.reply(
				`I was unable to fetch the archive channel! Please re-set one with \`${prefix}help set-archive\``,
			);
		}

		if (!archive.permissionsFor(this.client.user!.id)?.has(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'])) {
			return msg.util?.reply(
				`I don't have enough permissions to send messages in ${channel}! Please make sure I have \`Send Messages\`, \`Embed Links\` and \`Attach Files\`.`,
			);
		}

		if (!channel.manageable) return msg.util?.reply(`I don't have enough permissions to delete ${channel}.`);

		const m = await msg.channel.send('Creating archive...');
		const attachment = await this.client.exportHandler.createLog(channel.id);

		if (!attachment) return msg.util?.reply(`process failed - I was unable to create an archive.`);
		await m.edit(`Archive created! Sending to ${archive}...`);

		const embed = this.client.util
			.embed()
			.setColor(msg.guild?.me?.displayColor || this.client.config.color)
			.setTimestamp()
			.setTitle('Archived Channel')
			.setAuthor(`Archived by ${msg.author?.username}`, msg.author?.displayAvatarURL({ size: 2048 }))
			.setDescription(`#${channel.name} has been archived`);

		const sent = await archive.send({
			embed,
			files: [
				{
					attachment,
					name: `${channel.name}.html`,
				},
			],
		});

		await m.edit(`Successfully sent to ${archive}! Deleting local archive...`);

		await sent.edit(
			embed.addField(
				'Actions',
				oneLine`
					**[\(Open in Browser\)](https://fyko.net/transcript?uri=${sent.attachments.first()?.url})** - 
					**[\(Download Archive\)](${sent.attachments.first()?.url})**
				`,
			),
		);
		await m.edit(stripIndents`
			Successfully archived \`#${channel.name}\`! Deleting channel in 5 seconds...
	
			<${sent.url}>.
		`);

		if (channel.deletable) setTimeout(() => channel.delete().catch(() => undefined), 1000 * 5);
	}
}
