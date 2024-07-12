FROM node:lts-alpine
WORKDIR /app

ARG APP
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./dist/apps/${APP} .

COPY package.json package-lock.json ./

RUN pnpm install --production

ENV PORT=3000

EXPOSE ${PORT}

CMD node main.js
