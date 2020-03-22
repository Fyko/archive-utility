FROM node:12-alpine

LABEL name "Archive Utility"
LABEL version "1.2.0"
LABEL maintainer "Carter Himmel <me@fyko.net>"

WORKDIR /usr/archive-utility

COPY package.json pnpm-lock.yaml ./

RUN apk add --update \
&& apk add --no-cache ca-certificates \
&& apk add --no-cache --virtual .build-deps git curl build-base python g++ make \
&& curl -L https://unpkg.com/@pnpm/self-installer | node \
&& pnpm i \
&& apk del .build-deps

COPY . .

ENV ID= \
	DISCORD_TOKEN= \
	OWNERS= \
	COLOR= \
	PREFIX= \
	MONGO= \
	EXPORT_ENDPOINT= \
	API_PORT= 

RUN pnpm run build
CMD ["node", "."]

