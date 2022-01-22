FROM node:16-alpine

LABEL name "Archive Utility"
LABEL maintainer "Carter Himmel <fyko@sycer.dev>"

WORKDIR /usr/archive-utility

COPY package.json yarn.lock .yarnclean ./

RUN apk add --update
RUN apk add --no-cache ca-certificates
RUN apk add --no-cache --virtual .build-deps git curl build-base python3 g++ make libtool autoconf automake
RUN yarn install

COPY . .

RUN yarn run build
CMD ["yarn", "start"]
