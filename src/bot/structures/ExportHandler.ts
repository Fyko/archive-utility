import type ArchiveClient from '../client/ArchiveClient';
import fetch from 'node-fetch';

export default class ExportHandler {
	protected readonly client: ArchiveClient;

	public constructor(client: ArchiveClient) {
		this.client = client;
	}

	public async createLog(channelId: string): Promise<Buffer> {
		const request = await fetch(`${process.env.EXPORT_ENDPOINT}/v1/export`, {
			body: JSON.stringify({ channelId, token: this.client.token }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.buffer();
	}
}
