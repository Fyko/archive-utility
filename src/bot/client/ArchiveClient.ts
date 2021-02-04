import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { ColorResolvable, Intents, Message } from 'discord.js';
import { join } from 'path';
import { Gauge, register } from 'prom-client';
import type { Logger } from 'winston';
import { SettingsProvider } from '../../database';
import API from '../structures/API';
import ExportHandler from '../structures/ExportHandler';
import { logger } from '../util/logger';

declare module 'discord-akairo' {
	interface AkairoClient {
		logger: Logger;
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		config: ArchiveOptions;
		settings: SettingsProvider;
		exportHandler: ExportHandler;
		prometheus: {
			messageCounter: Gauge<string>;
			userHistogram: Gauge<string>;
			guildHistogram: Gauge<string>;
			exportedChannels: Gauge<string>;
		};

		archiveAPI: API;
	}
}

interface ArchiveOptions {
	token: string;
	owners: string | string[];
	color: ColorResolvable;
}

export default class ArchiveClient extends AkairoClient {
	public constructor(config: ArchiveOptions) {
		super({
			messageCacheLifetime: 300,
			messageCacheMaxSize: 20,
			messageSweepInterval: 900,
			ownerID: config.owners,
			ws: { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] },
		});

		this.config = config;
	}

	public config: ArchiveOptions;

	public exportHandler: ExportHandler = new ExportHandler(this);

	public logger: Logger = logger;

	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', 'commands'),
		prefix: (msg: Message): string => {
			if (msg.guild) {
				const req = this.settings.cache.guilds.get(msg.guild.id);
				if (req?.prefix) return req.prefix;
			}
			return 'arch!';
		},
		aliasReplacement: /-/g,
		allowMention: true,
		handleEdits: true,
		commandUtil: true,
		commandUtilLifetime: 3e5,
		defaultCooldown: 3000,
		argumentDefaults: {
			prompt: {
				modifyStart: (msg: Message, str: string) =>
					`${msg.author}, ${str}\n...or type \`cancel\` to cancel this command.`,
				modifyRetry: (msg: Message, str: string) =>
					`${msg.author}, ${str}\n... or type \`cancel\` to cancel this command.`,
				timeout: 'You took too long. Command cancelled.',
				ended: 'You took more than 3 tries! Command canclled',
				cancel: 'Sure thing, command cancelled.',
				retries: 3,
				time: 60000,
			},
			otherwise: '',
		},
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'inhibitors'),
	});

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
	});

	public settings: SettingsProvider = new SettingsProvider(this);

	public prometheus = (() => {
		// eslint-disable-next-line
		const client = this;
		return {
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
				help: 'Histogram of all users Archive Utility has seen.',
				collect: function () {
					this.set(client.guilds.cache.size);
				},
			}),
			exportedChannels: new Gauge({
				name: 'archive_utility_channels_exported',
				help: 'Total number of archived channels',
			}),
			register,
		};
	})();

	public readonly archiveAPI: API = new API(this);

	private async load(): Promise<this> {
		this.on('message', () => this.prometheus.messageCounter.inc());

		await this.settings.init();

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
			shard: this,
		});

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();

		return this;
	}

	public async launch(): Promise<string> {
		await this.load();
		return this.login(this.config.token);
	}
}
