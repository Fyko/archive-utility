import { stripIndents } from 'common-tags';
import { Command, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';

export default class GuildCommand extends Command {
	public constructor() {
		super('guide', {
			aliases: ['guide', 'info'],
			description: {
				content: 'Returns a guide on how to use ',
			},
			category: 'utilities',
		});
	}

	public async exec(msg: Message): Promise<Message | Message[] | void> {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg);
		const embed = this.client.util
			.embed()
			.setColor(msg.guild?.me?.displayColor || this.client.config.color)
			.setTitle('Archive Utility Guide')
			.setImage('https://i.imgur.com/tk2K5fi.png')
			.addField(
				'About',
				stripIndents`
                ${this.client.user?.username} is targeted for ["cook group"](https://www.urbandictionary.com/define.php?term=cookgroup) administrators.

				When the \`archive\` command is ran, ${this.client.user?.username} will create an archive of the provided channel, post it in the configured archive-log then delete the channel, thus reducing clutter in your server and reducing lag when navigating your server.
				
				**[\(Example Archive\)](https://fyko.net/transcript?uri=https://cdn.discordapp.com/attachments/674494465662255134/674498412560908288/01-25-yeezy-v2-yeshaya.html)**
                `,
			)
			.addField(
				'Setup',
				stripIndents`
				Hello, and thank you for using **${this.client.user!.username}**!

                To use ${
									this.client.user?.username
								}'s core feautures, you **must** have the \`Manage Channels\` permission.

                Before you can start archiving channels, you must first use the \`set-archive\` channel to configure where archives should be posted.
                Example: \`${prefix}set-archive #channel-archive\`

                Now that  you've set your channel archive, you can start archiving channels!
            `,
			)
			.addField(
				'Usage',
				stripIndents`
				You can archive a channel using the \`archive\` command.
				Example: \`${prefix}archive #release-channel\`

				After you run this command an archive will be created, then sent to your archive channel, then the channel will be deleted.
            `,
			)
			.addField(
				'Other',
				stripIndents`
				If you run into any problems please let us know in our [Support Server](https://fyko.net/discord)!
			`,
			);

		return msg.util?.reply({ embed });
	}
}
