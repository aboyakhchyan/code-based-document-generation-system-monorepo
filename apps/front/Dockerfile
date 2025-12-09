FROM node:22-latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 6600

CMD ["pnpm", "run", "start", "--host", "0.0.0.0",]
