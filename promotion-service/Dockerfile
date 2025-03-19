FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache curl

COPY ./promotion-service/package*.json ./

RUN npm install

COPY ./promotion-service ./promotion-service

COPY ./common ./common  

WORKDIR /usr/src/app/promotion-service

RUN npm run compile

CMD ["npm", "start"]
