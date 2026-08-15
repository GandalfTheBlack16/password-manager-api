FROM node:22.23-alpine3.24

RUN ["npm", "i", "-g", "pnpm"]

WORKDIR /usr/app

COPY ./package.json .

RUN ["pnpm", "i"]

COPY . .

RUN ["pnpm", "build"]

CMD ["pnpm", "start"]