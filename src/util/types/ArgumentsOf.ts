/* eslint-disable @typescript-eslint/indent */
/**
    https://github.com/Naval-Base/yuudachi/blob/main/LICENSE
    Copyright (C) 2021  Noel Buechler

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import type { ApplicationCommandOptionType } from 'discord-api-types/v9';
import type { GuildChannel, GuildMember, Role, User } from 'discord.js';

export type Command = Readonly<{
	name: string;
	description: string;
	options?: readonly Option[];
}>;

type Option = Readonly<
	{
		name: string;
		description: string;
		required?: boolean;
	} & (
		| {
				type: ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup;
				options?: readonly Option[];
		  }
		| {
				type: ApplicationCommandOptionType.String;
				choices?: readonly Readonly<{ name: string; value: string }>[];
		  }
		| {
				type: ApplicationCommandOptionType.Integer | /* ApplicationCommandOptionType.Number */ 10;
				choices?: readonly Readonly<{ name: string; value: number }>[];
		  }
		| {
				type:
					| ApplicationCommandOptionType.Boolean
					| ApplicationCommandOptionType.User
					| ApplicationCommandOptionType.Channel
					| ApplicationCommandOptionType.Role
					| ApplicationCommandOptionType.Mentionable;
		  }
	)
>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type TypeIdToType<T, O, C> = T extends ApplicationCommandOptionType.Subcommand
	? ArgumentsOfRaw<O>
	: T extends ApplicationCommandOptionType.SubcommandGroup
	? ArgumentsOfRaw<O>
	: T extends ApplicationCommandOptionType.String
	? C extends readonly { value: string }[]
		? C[number]['value']
		: string
	: T extends ApplicationCommandOptionType.Integer | /* ApplicationCommandOptionType.Number */ 10
	? C extends readonly { value: number }[]
		? C[number]['value']
		: number
	: T extends ApplicationCommandOptionType.Boolean
	? boolean
	: T extends ApplicationCommandOptionType.User
	? { user: User; member?: GuildMember /* | (APIGuildMember & { permissions: Permissions }) */ }
	: T extends ApplicationCommandOptionType.Channel
	? GuildChannel /* | (APIPartialChannel & { permissions: Permissions }) */
	: T extends ApplicationCommandOptionType.Role
	? Role /* | APIRole */
	: T extends ApplicationCommandOptionType.Mentionable
	?
			| { user: User; member?: GuildMember /* | (APIGuildMember & { permissions: Permissions }) */ }
			| GuildChannel /* | (APIPartialChannel & { permissions: Permissions }) */
			| Role /* | APIRole */
	: never;

type OptionToObject<O> = O extends {
	name: infer K;
	type: infer T;
	required?: infer R;
	options?: infer O;
	choices?: infer C;
}
	? K extends string
		? R extends true
			? { [k in K]: TypeIdToType<T, O, C> }
			: T extends ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup
			? { [k in K]: TypeIdToType<T, O, C> }
			: { [k in K]?: TypeIdToType<T, O, C> }
		: never
	: never;

type ArgumentsOfRaw<O> = O extends readonly any[] ? UnionToIntersection<OptionToObject<O[number]>> : never;

export type ArgumentsOf<C extends Command> = C extends { options: readonly Option[] }
	? UnionToIntersection<OptionToObject<C['options'][number]>>
	: unknown;
