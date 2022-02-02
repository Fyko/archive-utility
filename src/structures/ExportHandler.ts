import fetch from 'node-fetch';

export const enum ExportFormat {
	PlainText,
	HtmlDark,
	HtmlLight,
	CSV,
	JSON,
}

export const ExportFormatExtensions = {
	[ExportFormat.PlainText]: 'txt',
	[ExportFormat.HtmlDark]: 'html',
	[ExportFormat.HtmlLight]: 'html',
	[ExportFormat.CSV]: 'csv',
	[ExportFormat.JSON]: 'json',
} as const;

export class ExportHandler {
	public async createLog(channel_id: string, format = ExportFormat.HtmlDark): Promise<Buffer> {
		const request = await fetch(`${process.env.EXPORT_ENDPOINT}/v2/export`, {
			body: JSON.stringify({ channel_id, token: process.env.DISCORD_TOKEN!, export_format: format }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.buffer();
	}
}
