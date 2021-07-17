import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

export async function postHaste(code: string, lang?: string): Promise<string> {
	try {
		if (code.length > 400000) {
			return 'Document exceeds maximum length.';
		}
		const res = await fetch('https://paste.nomsy.net/documents', { method: 'POST', body: code });
		const { key, message } = await res.json();
		if (!key) {
			return message;
		}
		return `https://paste.nomsy.net/${key}${lang && `.${lang}`}`;
	} catch (err) {
		throw err;
	}
}

export function displayHTML(attachmentUri: string, displayAt = process.env.DISPLAY_HTML_URL): string {
	const q = new URLSearchParams();
	q.set('uri', attachmentUri);

	return `${displayAt}?${q}`;
}
