import ArchiveClient from './bot/client/ArchiveClient';

new ArchiveClient({
	token: process.env.TOKEN!,
	owners: process.env.OWNERS!.split(','),
	color: process.env.COLOR!,
}).launch();
