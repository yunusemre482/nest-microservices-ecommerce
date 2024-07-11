FROM node:lts-alpine

WORKDIR /usr/src/app

COPY dist/apps/api-gateway ./
COPY package*.json ./

ENV PORT=3001

EXPOSE ${PORT}

RUN npm install

# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

CMD ["node", "main"]
