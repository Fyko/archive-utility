import type { ConstantsEvents } from 'discord.js';

export interface Listener {
	readonly event: ConstantsEvents[keyof ConstantsEvents];

	exec(...args: unknown[]): unknown | Promise<unknown>;
}
