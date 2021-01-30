import express, { Application, Request, Response } from 'express';
import ArchiveClient from '../client/ArchiveClient';
import helmet from 'helmet';

export default class API {
	public app: Application = express();
	protected readonly client: ArchiveClient;
	protected readonly port: number = Number(process.env.API_PORT!);

	public constructor(client: ArchiveClient) {
		this.client = client;
	}

	private _sendMetrics(_: Request, res: Response): Response {
		res.setHeader('Content-Type', this.client.prometheus.register.contentType);
		return res.status(200).send(this.client.prometheus.register.metrics());
	}

	private _initMiddleware(): this {
		this.app.use(helmet());
		return this;
	}

	private _initRoutes(): this {
		this.app.get('/metrics', (req, res) => this._sendMetrics(req, res));
		return this;
	}

	private _listen(): number {
		this.app.listen(this.port);
		this.client.logger.info(`[API]: API is live on port ${this.port}.`);
		return this.port;
	}

	private _setup(): this {
		this._initMiddleware();
		this._initRoutes();
		return this;
	}

	public async init(): Promise<this> {
		this._setup();
		await this._listen();
		return this;
	}
}
