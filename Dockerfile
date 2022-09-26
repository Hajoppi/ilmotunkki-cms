FROM node:16
# Installing libvips-dev for sharp Compatability
RUN apt-get update && apt-get install libvips-dev -y
ARG NODE_ENV=production
ARG URL=cms
ENV URL=${URL}
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn config set network-timeout 600000 -g && yarn install

COPY ./ .

# Build added plugins
WORKDIR /app/src/plugins/management
RUN yarn config set network-timeout 600000 -g && yarn install
RUN yarn build

WORKDIR /app
RUN yarn build
EXPOSE 1337

CMD ["yarn", "start"]