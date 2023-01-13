export type ServerSettings = {
	archive_channel: string;
	created_at: Date;
	id: string;
}

export type ArchiveRecord = {
	channel_id: string;
	channel_name: string;
	created_at: Date;
	id: string;
	message_count: number;
	performed_by: string;
	server_id: string;
	updated_at: Date;
}
