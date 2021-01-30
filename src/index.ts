import ArchiveClient from './bot/client/ArchiveClient';

void new ArchiveClient({
	token: process.env.TOKEN!,
	owners: process.env.OWNERS!.split(','),
	color: process.env.COLOR!,
}).launch();
