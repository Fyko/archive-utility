alter table "archive_utility"."archive"
  add constraint "archive_server_id_fkey"
  foreign key ("server_id")
  references "archive_utility"."server"
  ("id") on update restrict on delete restrict;
