import type { CommandInteraction } from 'discord.js';

export type FailedPredicateResponse = {
	code: string;
	message: string;
}

export type Command = {
	readonly data: Record<string, unknown> & { name: string };

	exec(interaction: CommandInteraction<'cached'>, args: unknown, locale: string): Promise<unknown> | unknown;

	predicate?(
		interaction: CommandInteraction<'cached'>,
	): FailedPredicateResponse | Promise<boolean> | Promise<FailedPredicateResponse> | boolean;
}
