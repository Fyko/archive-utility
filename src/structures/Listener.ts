import type { Events } from 'discord.js';

export type Listener = {
	readonly event: Events;

	exec(...args: unknown[]): Promise<unknown> | unknown;
}
