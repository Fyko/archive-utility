import ArchiveClient from '../client/ArchiveClient';
import fetch from 'node-fetch';

export default class ExportHandler {
	protected readonly client: ArchiveClient;

	public constructor(client: ArchiveClient) {
		this.client = client;
	}

	public async createLog(channel: string): Promise<Buffer> {
		const request = await fetch(`${process.env.EXPORT_ENDPOINT}/export`, {
			body: JSON.stringify({ channel, token: this.client.token }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.buffer();
	}
}
