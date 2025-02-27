FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY env-docker /usr/src/app/.env
RUN rm /usr/src/app/env-docker

EXPOSE 3000

CMD ["npm", "start"]