import fetch from 'node-fetch';

const enum ExportFormat {
	PlainText,
	HtmlDark,
	HtmlLight,
	CSV,
	JSON,
}

export class ExportHandler {
	public async createLog(channel_id: string): Promise<Buffer> {
		const request = await fetch(`${process.env.EXPORT_ENDPOINT}/v2/export`, {
			body: JSON.stringify({ channel_id, token: process.env.DISCORD_TOKEN!, export_format: ExportFormat.HtmlDark }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.buffer();
	}
}
