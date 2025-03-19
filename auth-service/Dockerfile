FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache curl

COPY ./auth-service/package*.json ./

RUN npm install

COPY ./auth-service ./auth-service

COPY ./common ./common  

WORKDIR /usr/src/app/auth-service

RUN npm run compile

CMD ["npm", "start"]
