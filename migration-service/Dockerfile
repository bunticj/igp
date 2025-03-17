FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./migration-service/package*.json ./

RUN npm install

COPY ./migration-service ./migration-service

COPY ./common ./common  

WORKDIR /usr/src/app/migration-service

CMD ["npm", "start"]