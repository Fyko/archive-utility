import 'reflect-metadata';

import process from 'node:process';
import { Collection } from '@discordjs/collection';
import { container } from 'tsyringe';
import { deploy } from './deploy.js';
import type { Command} from '#structs';
import { loadCommands, kExportClient } from '#util';

process.env.NODE_ENV ??= 'development';

container.register(kExportClient, { useValue: '' });

async function main() {
	const commands = new Collection<string, Command>();
	await loadCommands(commands);

	void deploy(commands.map((cmd) => cmd.data));
}

void main();
