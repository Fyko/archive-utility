import type { CommandInteraction } from 'discord.js';
import type { Command } from '#structs';

const data = {
	name: 'ping',
	description: 'Ensures the bot is responding to commands.',
} as const;

export default class implements Command {
	public readonly data = data;

	public async exec(interaction: CommandInteraction) {
		return interaction.reply({ content: 'Pong!', ephemeral: true });
	}
}
