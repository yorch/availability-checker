FROM mcr.microsoft.com/playwright:bionic

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
LABEL \
    maintainer="jorge.barnaby@gmail.com" \
    org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="Availability Checker" \
    org.label-schema.description="Checks for products if they are on stock" \
    org.label-schema.url="https://github.com/yorch" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/yorch/availability-checker" \
    org.label-schema.vendor="Barnaby Tech" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0"

RUN apt-get update && apt-get install -y wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget -q https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --immutable \
    && yarn cache clean
COPY src ./src

ENV NODE_ENV production

ENV LOG_FILE=/app/logs/combined.log
ENV LOG_ERROR_FILE=/app/logs/error.log

CMD mkdir -p /app/logs && \
    touch ${LOG_FILE} && \
    touch ${LOG_ERROR_FILE} && \
    dockerize \
    -stdout ${LOG_FILE} \
    -stderr ${LOG_ERROR_FILE} \
    node src/index.js
