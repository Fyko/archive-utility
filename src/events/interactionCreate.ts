import { logger } from '#logger';
import type { Command, Listener } from '#structs';
import { kCommands, transformArguments } from '#util';
import { Client, Collection, CommandInteraction, Constants } from 'discord.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class implements Listener {
	public readonly event = Constants.Events.INTERACTION_CREATE;

	public constructor(
		public readonly client: Client<true>,
		@inject(kCommands) public readonly commands: Collection<string, Command>,
	) {}

	public exec = (): void => {
		this.client.on(this.event, (interaction) => {
			if (interaction.isCommand() && interaction.inCachedGuild()) void this.handleCommand(interaction);
		});
	};

	private readonly handleCommand = async (interaction: CommandInteraction<'cached'>): Promise<void> => {
		const name = interaction.commandName;
		const command = this.commands.get(name);
		if (command) {
			const user = interaction.user;
			const info = `command "${name}"; triggered by ${user.username}#${user.discriminator} (${user.id})`;
			logger.info(`Executing ${info}`);

			// perform predicate
			if (command.predicate) {
				const result = await command.predicate(interaction);
				if (typeof result !== 'boolean') {
					logger.info(`Predicate failed @ ${info}; code: ${result.code}`);
					if (result.message) {
						return interaction.reply({ content: result.message, ephemeral: true });
					}
				}
			}

			try {
				await command.exec(interaction, transformArguments(interaction.options.data), interaction.locale);
				logger.info(`Successfully executed ${info}`);
			} catch (err) {
				logger.error({ msg: `Failed to execute ${info}`, err });
			}
		}
	};
}
