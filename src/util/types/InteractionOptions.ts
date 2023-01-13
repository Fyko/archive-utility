/**
 * https://github.com/Naval-Base/yuudachi/blob/main/LICENSE
 * Copyright (C) 2021  Noel Buechler
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { CommandInteractionOption } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import type { ArgumentsOf, Command } from './ArgumentsOf.js';

export function transformArguments<T extends Command>(options: readonly CommandInteractionOption[]): ArgumentsOf<T> {
	const opts: any = {};

	for (const top of options) {
		if (top.type === ApplicationCommandOptionType.Subcommand || top.type === ApplicationCommandOptionType.SubcommandGroup) {
			opts[top.name] = transformArguments(top.options ? [...top.options] : []);
		} else if (top.type === ApplicationCommandOptionType.User) {
			opts[top.name] = { user: top.user, member: top.member };
		} else if (top.type === ApplicationCommandOptionType.Channel) {
			opts[top.name] = top.channel;
		} else if (top.type === ApplicationCommandOptionType.Role) {
			opts[top.name] = top.role;
		} else {
			opts[top.name] = top.value;
		}
	}

	return opts;
}
