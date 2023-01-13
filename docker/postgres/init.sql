CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS "archive_utility";

CREATE TABLE "archive_utility"."server" (
  "id" text NOT NULL, 
  "created_at" timestamptz NOT NULL DEFAULT now(), 
  "archive_channel" text, 
  PRIMARY KEY ("id"), 
  UNIQUE ("id")
);

CREATE TABLE "archive_utility"."archive" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
  "created_at" timestamptz NOT NULL DEFAULT now(), 
  "updated_at" timestamptz NOT NULL DEFAULT now(), 
  "channel_id" text NOT NULL, 
  "channel_name" text NOT NULL, 
  "server_id" text NOT NULL, 
  "performed_by" text NOT NULL, 
  "message_count" integer NOT NULL, 
  PRIMARY KEY ("id")
);

CREATE OR REPLACE FUNCTION "archive_utility"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE _new record;
BEGIN _new := NEW;
_new."updated_at" = NOW();
RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_archive_updated_at" BEFORE 
UPDATE 
  ON "archive_utility"."archive" FOR EACH ROW EXECUTE PROCEDURE "archive_utility"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_archive_updated_at" ON "archive_utility"."archive" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
alter table 
  "archive_utility"."archive" 
add 
  constraint "archive_server_id_fkey" foreign key ("server_id") references "archive_utility"."server" ("id") on update restrict on delete restrict;
