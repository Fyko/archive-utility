import 'reflect-metadata';

import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { Collection } from '@discordjs/collection';
import { createExporterClient } from '@fyko/export-api/client';
import { Client, IntentsBitField, Options } from 'discord.js';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import postgres from 'postgres';
import { Gauge, register } from 'prom-client';
import { container } from 'tsyringe';
import type { Command, Listener } from '#structs';
import { kCommands, kExportClient, kListeners, kMetrics, kSQL, loadCommands, loadListeners } from '#util';

process.env.NODE_ENV ??= 'development';

const client = new Client({
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
	makeCache: Options.cacheWithLimits({
		MessageManager: 5,
	}),
});

const exportClient = createExporterClient(process.env.EXPORT_ENDPOINT!);
const commands = new Collection<string, Command>();
const listeners = new Collection<string, Listener>();

const prometheus = {
	messageCounter: new Gauge({
		name: 'archive_utility_messages_total',
		help: 'Total number of messages Archive Utility has seen.',
	}),
	userHistogram: new Gauge({
		name: 'archive_utility_user_histogram',
		help: 'Histogram of all users Archive Utility has seen.',
		collect () {
			this.set(client.guilds.cache.reduce((acc, guild) => (acc + guild.memberCount), 0));
		},
	}),
	guildHistogram: new Gauge({
		name: 'archive_utility_guild_histogram',
		help: 'Histogram of Archive Utility Guilds.',
		collect () {
			this.set(client.guilds.cache.size);
		},
	}),
	exportedChannels: new Gauge({
		name: 'archive_utility_channels_exported',
		help: 'Total number of archived channels.',
	}),
	register,
};
export type Metrics = typeof prometheus;

const sql = postgres(process.env.DATABASE_URL!, {
	types: {
		bigint: postgres.BigInt,
	},
});

container.register(Client, { useValue: client });
container.register(kCommands, { useValue: commands });
container.register(kListeners, { useValue: listeners });
container.register(kMetrics, { useValue: prometheus });
container.register(kExportClient, { useValue: exportClient });
container.register(kSQL, { useValue: sql });

async function start() {
	await i18next.use(Backend).init({
		backend: {
			loadPath: fileURLToPath(new URL('locales/{{lng}}/{{ns}}.json', import.meta.url)),
		},
		cleanCode: true,
		fallbackLng: ['en-US'],
		defaultNS: 'translation',
		lng: 'en-US',
		ns: ['translation'],
	});

	await loadCommands(commands);
	await loadListeners(listeners);

	await client.login();
}

void start();
