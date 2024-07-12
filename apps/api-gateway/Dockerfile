FROM node:lts-alpine
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./dist/apps/api-gateway .

COPY package.json package-lock.json ./

RUN pnpm install --production

ENV PORT=3000

EXPOSE ${PORT}

CMD node main.js


