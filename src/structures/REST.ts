import { REST as DjsRest } from '@discordjs/rest';
import {
	RESTGetAPIChannelMessageResult,
	RESTGetAPIUserResult,
	RESTPatchAPIChannelMessageJSONBody,
	RESTPatchAPIChannelMessageResult,
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIChannelMessageResult,
	Routes,
} from 'discord-api-types/v9';

export class REST extends DjsRest {
	public async fetchGuildMessage(channelId: string, messageId: string) {
		return (await this.get(Routes.channelMessage(channelId, messageId))) as RESTGetAPIChannelMessageResult;
	}

	public async sendMessage(channelId: string, body: RESTPostAPIChannelMessageJSONBody) {
		return (await this.post(Routes.channelMessages(channelId), { body })) as RESTPostAPIChannelMessageResult;
	}

	public async updateMessage(channelId: string, messageId: string, body: RESTPatchAPIChannelMessageJSONBody) {
		return (await this.patch(Routes.channelMessage(channelId, messageId), {
			body,
		})) as RESTPatchAPIChannelMessageResult;
	}

	public async fetchUser(userId: string) {
		return (await this.get(Routes.user(userId))) as RESTGetAPIUserResult;
	}
}
