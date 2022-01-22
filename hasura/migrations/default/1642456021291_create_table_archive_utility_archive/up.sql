CREATE TABLE "archive_utility"."archive" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "channel_id" text NOT NULL, "channel_name" text NOT NULL, "server_id" text NOT NULL, "performed_by" text NOT NULL, PRIMARY KEY ("id") );
CREATE OR REPLACE FUNCTION "archive_utility"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_archive_utility_archive_updated_at"
BEFORE UPDATE ON "archive_utility"."archive"
FOR EACH ROW
EXECUTE PROCEDURE "archive_utility"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_archive_utility_archive_updated_at" ON "archive_utility"."archive" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
