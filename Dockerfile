FROM node:20.11-alpine
WORKDIR /app

ARG APP
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./dist/apps/${APP} .

RUN pnpm install --production
RUN pnpm install @nestjs/platform-express

RUN pnpm install -g pm2

RUN pm2 install pm2-logrotate
RUN pm2 install pm2-server-monit

RUN pm2 set pm2-logrotate:retain 7
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss

ENV PORT=3000

EXPOSE ${PORT}

# CMD ["node", "main.js"]
CMD ["pm2-runtime", "start", "main.js", "--name", "api-gateway", "--watch"]
