import fetch from 'node-fetch';
import { logger } from '#logger';
import { fileURLToPath, URL, URLSearchParams } from 'url';
import { scan } from 'fs-nextra';
import { extname } from 'path';
import { container } from 'tsyringe';
import type { Command, Listener } from '#structs';
import type Collection from '@discordjs/collection';

export * from './symbols';
export * from './types';
export * from './constants';
export * from './logger';

export async function postHaste(code: string, lang?: string): Promise<string> {
	try {
		if (code.length > 400000) {
			return 'Document exceeds maximum length.';
		}
		const res = await fetch('https://paste.nomsy.net/documents', { method: 'POST', body: code });
		const { key, message } = await res.json();
		if (!key) {
			return message;
		}
		return `https://paste.nomsy.net/${key}${lang && `.${lang}`}`;
	} catch (err) {
		throw err;
	}
}

export function displayHTML(attachmentUri: string, displayAt = process.env.DISPLAY_HTML_URL): string {
	const q = new URLSearchParams();
	q.set('uri', attachmentUri);

	return `${displayAt}?${q}`;
}

async function walk(path: string) {
	return (
		await scan(path, {
			filter: (stats) => stats.isFile() && ['.js', '.ts'].includes(extname(stats.name)),
		})
	).keys();
}

export async function loadCommands(commandStore: Collection<string, Command>) {
	const files = await walk(fileURLToPath(new URL('../commands', import.meta.url)));

	for (const file of files) {
		const command = container.resolve<Command>((await import(file)).default);
		commandStore.set(command.data.name, command);
		logger.info(`Successfully loaded command "${command.data.name}"!`);
	}
}

export async function loadListeners(listenerStore: Collection<string, Listener>) {
	const files = await walk(fileURLToPath(new URL('../events', import.meta.url)));

	for (const file of files) {
		const listener = container.resolve<Listener>((await import(file)).default);
		listenerStore.set(listener.event, listener);
		listener.exec();
		logger.info(`Successfully loaded listener "${listener.event}"!`);
	}
}
