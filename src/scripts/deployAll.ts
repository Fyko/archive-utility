import 'reflect-metadata';
process.env.NODE_ENV ??= 'development';

import { deploy } from './deploy';
import { loadCommands, kExportHandler } from '#util';
import Collection from '@discordjs/collection';
import { Command, ExportHandler } from '#structs';
import { container } from 'tsyringe';

container.register(kExportHandler, { useValue: new ExportHandler() });

async function main() {
	const commands = new Collection<string, Command>();
	await loadCommands(commands);

	void deploy(commands.map((c) => c.data));
}

void main();
