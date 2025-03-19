FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache curl

COPY ./notification-service/package*.json ./

RUN npm install

COPY ./notification-service ./notification-service

COPY ./common ./common  

WORKDIR /usr/src/app/notification-service

RUN npm run compile

CMD ["npm", "start"]