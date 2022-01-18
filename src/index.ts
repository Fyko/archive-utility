process.env.NODE_ENV ??= 'development';
import 'reflect-metadata';

import { Command, Listener, REST, ExportHandler } from '#structs';
import { kCommands, kListeners, kMetrics, kREST, loadCommands, loadListeners, kExportHandler } from '#util';
import Collection from '@discordjs/collection';
import { Client, Intents, Options } from 'discord.js';
import { Gauge, register } from 'prom-client';
import { container } from 'tsyringe';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { fileURLToPath, URL } from 'url';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	makeCache: Options.cacheWithLimits({
		MessageManager: 5,
	}),
});
const commands = new Collection<string, Command>();
const listeners = new Collection<string, Listener>();
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

const prometheus = {
	messageCounter: new Gauge({
		name: 'archive_utility_messages_total',
		help: 'Total number of messages Archive Utility has seen.',
	}),
	userHistogram: new Gauge({
		name: 'archive_utility_user_histogram',
		help: 'Histogram of all users Archive Utility has seen.',
		collect: function () {
			return this.set(client.guilds.cache.reduce((acc, g) => (acc += g.memberCount), 0));
		},
	}),
	guildHistogram: new Gauge({
		name: 'archive_utility_guild_histogram',
		help: 'Histogram of Archive Utility Guilds.',
		collect: function () {
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

container.register(Client, { useValue: client });
container.register(kCommands, { useValue: commands });
container.register(kListeners, { useValue: listeners });
container.register(kREST, { useValue: rest });
container.register(kMetrics, { useValue: prometheus });
container.register(kExportHandler, { useValue: new ExportHandler() });

async function start() {
	await i18next.use(Backend).init({
		backend: {
			loadPath: fileURLToPath(new URL('./locales/{{lng}}/{{ns}}.json', import.meta.url)),
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
