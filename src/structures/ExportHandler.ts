import fetch from 'node-fetch';

export class ExportHandler {
	public async createLog(channelId: string): Promise<Buffer> {
		const request = await fetch(`${process.env.EXPORT_ENDPOINT}/v1/export`, {
			body: JSON.stringify({ channelId, token: process.env.DISCORD_TOKEN! }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.buffer();
	}
}
