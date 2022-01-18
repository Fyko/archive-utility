import type { CommandInteraction } from 'discord.js';

export interface FailedPredicateResponse {
	code: string;
	message: string;
}

export interface Command {
	readonly data: { name: string } & Record<string, unknown>;

	predicate?(
		interaction: CommandInteraction,
	): Promise<FailedPredicateResponse> | Promise<boolean> | FailedPredicateResponse | boolean;

	exec(interaction: CommandInteraction, args: unknown, locale: string): unknown | Promise<unknown>;
}
