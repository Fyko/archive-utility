import { GraphQLClient } from 'graphql-request';
import { getSdk } from './gql/generated';

const HASURA_URL: string = process.env.HASURA_URL!;
const HASURA_ADMIN_SECRET: string = process.env.HASURA_ADMIN_SECRET!;

const client = new GraphQLClient(HASURA_URL, {
	headers: {
		'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
	},
});
export const hasuraClient = getSdk(client);
