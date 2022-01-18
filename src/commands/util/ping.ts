import type { Command } from '#structs';
import type { CommandInteraction } from 'discord.js';

const data = {
	name: 'ping',
	description: 'Ensures the bot is responding to commands.',
} as const;

export default class implements Command {
	public readonly data = data;

	public exec(interaction: CommandInteraction) {
		return interaction.reply({ content: 'Pong!', ephemeral: true });
	}
}
