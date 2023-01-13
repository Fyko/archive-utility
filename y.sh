#!/bin/sh
stage="$1"
shift
rest="$@"
docker-compose -f docker-compose.$stage.yml $rest
