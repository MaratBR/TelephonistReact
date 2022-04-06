FROM node:17-alpine3.14 AS build
RUN npm update -g yarn
WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build

FROM nginx:1.21.4-alpine AS server
WORKDIR /
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN mkdir dist
COPY --from=build /app/dist /dist
RUN mkdir -p /etc/confd
COPY ./docker/confd /etc/confd
RUN rm /docker-entrypoint.sh && rm -r /docker-entrypoint.d
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN cp /dist/index.html index.html.tmpl

# thank you
# https://github.com/sysboss/docker-nginx-with-confd/blob/master/Dockerfile
ENV CONFD_VERSION="0.11.0" \
    CONFD_URL="https://github.com/kelseyhightower/confd/releases/download"
RUN apk --no-cache --update add ca-certificates openssl \
 && wget -T 5 ${CONFD_URL}/v${CONFD_VERSION}/confd-${CONFD_VERSION}-linux-amd64 -O /bin/confd \
 && chmod +x /bin/confd \
 && apk del ca-certificates openssl

ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]
