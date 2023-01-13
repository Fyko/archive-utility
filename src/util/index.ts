import { extname } from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL, URLSearchParams } from 'node:url';
import type { Collection } from '@discordjs/collection';
import { scan } from 'fs-nextra';
import fetch from 'node-fetch';
import { container } from 'tsyringe';
import { logger } from '#logger';
import type { Command, Listener } from '#structs';

export * from './symbols.js';
export * from './types/index.js';
export * from './constants.js';
export * from './logger.js';

export async function postHaste(code: string, lang?: string): Promise<string> {
	if (code.length > 400_000) {
		return 'Document exceeds maximum length.';
	}

	const res = await fetch('https://paste.nomsy.net/documents', { method: 'POST', body: code });
	const { key, message } = await res.json() as { key: string; message: string };
	if (!key) {
		return message;
	}

	return `https://paste.nomsy.net/${key}${lang && `.${lang}`}`;
}

export function list(arr: string[], conj = 'and'): string {
	const len = arr.length;
	if (len === 0) return '';
	if (len === 1) return arr[0];

	return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
}

export function displayHTML(attachmentUri: string, displayAt = process.env.DISPLAY_HTML_URL): string {
	const query = new URLSearchParams();
	query.set('uri', attachmentUri);

	return `${displayAt}?${query}`;
}

async function walk(path: string, notInclude: string[] = []) {
	return (
		await scan(path, {
			filter: (stats, path) =>
				stats.isFile() && ['.js', '.ts'].includes(extname(stats.name)) && !notInclude.some((not) => path.includes(not)),
		})
	).keys();
}

export async function loadCommands(commandStore: Collection<string, Command>) {
	const files = await walk(fileURLToPath(new URL('../commands', import.meta.url)), ['sub']);

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
