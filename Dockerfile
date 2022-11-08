FROM node:14.16.0-alpine as node
FROM ruby:2.7.2-alpine3.13

RUN apk add git
RUN apk add build-base
RUN apk add libxml2-dev libxslt-dev
RUN apk add postgresql-dev
RUN apk add postgresql-client
RUN apk add tzdata
RUN apk add graphicsmagick
RUN gem install bundler:2.2.14

ENV PATH=/var/binstubs:$PATH \
    RAILS_LOG_TO_STDOUT=enabled \
    RAILS_ENV=development \
    NODE_ENV=development \
    SECRET_KEY_BASE=123abcd
ENV BUNDLE_JOBS=4 \
    BUNDLE_PATH=/var/bundle \
    BUNDLE_WITHOUT=production,staging \
    BUNDLE_BINSTUBS=/var/binstubs

COPY --from=node /opt/yarn-* /opt/yarn
COPY --from=node /usr/local/bin/node /usr/local/bin/
RUN ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarnpkg

WORKDIR /app

CMD ["rails","s","-b","0.0.0.0"]
