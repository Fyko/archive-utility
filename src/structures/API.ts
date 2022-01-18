import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import { logger } from '#logger';
import { inject, injectable } from 'tsyringe';
import { kMetrics } from '../util';
import type { Metrics } from '../';

@injectable()
export class API {
	public app: Application = express();
	protected readonly port: number = Number(process.env.API_PORT!);

	public constructor(@inject(kMetrics) public readonly metrics: Metrics) {}

	private async _sendMetrics(_: Request, res: Response): Promise<Response> {
		res.setHeader('Content-Type', this.metrics.register.contentType);
		return res.status(200).send(await this.metrics.register.metrics());
	}

	private _initMiddleware(): this {
		this.app.use(helmet());
		return this;
	}

	private _initRoutes(): this {
		this.app.get('/metrics', (req, res) => void this._sendMetrics(req, res));
		return this;
	}

	private _listen(): number {
		this.app.listen(this.port);
		logger.info(`[API]: API is live on port ${this.port}.`);
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
