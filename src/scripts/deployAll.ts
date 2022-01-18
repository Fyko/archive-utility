import 'reflect-metadata';
process.env.NODE_ENV ??= 'development';

import { deploy } from './deploy';
import { loadCommands } from '#util';
import Collection from '@discordjs/collection';
import type { Command } from '#structs';

async function main() {
	const commands = new Collection<string, Command>();
	await loadCommands(commands);

	void deploy(commands.map((c) => c.data));
}

void main();
