import { bold, inlineCode } from '@discordjs/builders';
import { stripIndents } from 'common-tags';
import type { CommandInteraction } from 'discord.js';
import type { Command } from '#structs';

const data = {
	name: 'guide',
	description: 'Provides information on how to use the bot',
} as const;

export default class implements Command {
	public readonly data = data;

	public async exec(interaction: CommandInteraction) {
		const username = interaction.client.user!.username;
		const archive = inlineCode('/archive');
		const setArchive = inlineCode('/config set archive-channel');
		const openInBrowser = inlineCode('(Open In Browser)');
		const info = stripIndents`
			${username} creates archives of Discord channels and posts them in a configured archive channel.

			${bold('Before')} archiving channels, you must configure an archive ouput channel with the command ${setArchive}.
			After, you can archive a channel by running ${archive}.

			When running the ${archive} command, you'll have the option to auto-delete the channel after creating an archive.
			This is disabled by default because once a channel is deleted, Discord will delete all images and files uploaded to the channel.
			Additionally, when a user changes their avatar, it will not update within the archive.

			To combat this, before deleting a channel you've created an archive for, click the ${openInBrowser} button, right click, and click ${inlineCode('Save Page As')}.
			Then, in the ${inlineCode('Save as type')} section, select ${inlineCode('Wep Page, complete')}. Then, click ${inlineCode('Save')}.
			Doing so will [create a folder](<http://tugboat.dev/80biq4.png>) with the files belonging to the archive to avoid "Missing File" errors when the channel is deleted. 

			If you have any questions or concerns, feel free to join our [Discord server](<https://discord.gg/uVuPaFAEYJ>).
			${username} is [Open Source](<https://github.com/Fyko/archive-utility>)!
		`;

		return interaction.reply({ content: info, ephemeral: true });
	}
}
