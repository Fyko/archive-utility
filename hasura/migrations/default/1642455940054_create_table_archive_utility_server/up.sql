CREATE TABLE "archive_utility"."server" ("id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "archive_channel" text, PRIMARY KEY ("id") , UNIQUE ("id"));
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
CREATE TRIGGER "set_archive_utility_server_updated_at"
BEFORE UPDATE ON "archive_utility"."server"
FOR EACH ROW
EXECUTE PROCEDURE "archive_utility"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_archive_utility_server_updated_at" ON "archive_utility"."server" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
