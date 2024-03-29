FROM node:16
# Installing libvips-dev for sharp Compatability
RUN apt-get update && apt-get install libvips-dev -y
ARG NODE_ENV=production
ARG URL=cms
ENV URL=${URL}
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install

COPY ./ .

# Build added plugins
WORKDIR /app/src/plugins/management
RUN npm install
RUN npm run build

WORKDIR /app
RUN npm run build
EXPOSE 1337

CMD ["npm", "start"]