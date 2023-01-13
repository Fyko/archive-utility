FROM debian:bullseye

LABEL name "Archive Utility"
LABEL maintainer "Carter Himmel <fyko@sycer.dev>"

# since we're starting non-interactive shell, 
# we wil need to tell bash to load .bashrc manually
ENV BASH_ENV ~/.bashrc
# needed by volta() function
ENV VOLTA_HOME /root/.volta
# make sure packages managed by volta will be in PATH
ENV PATH $VOLTA_HOME/bin:$PATH

ENV YARN_CACHE_FOLDER=/usr/local/yarn-cache
VOLUME /usr/local/yarn-cache

WORKDIR /usr/archive-utility

COPY . .

RUN apt-get update; apt install -y curl 

# install volta
RUN curl https://get.volta.sh | bash

RUN yarn install --immutable

RUN yarn run build
CMD ["yarn", "start"]
