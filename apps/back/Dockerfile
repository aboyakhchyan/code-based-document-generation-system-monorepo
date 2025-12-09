FROM node:22-latest

WORKDIR /app


COPY package.json ./

RUN npm install -g pnpm
RUN pnpm install


COPY . .

COPY prisma ./prisma/
RUN npx prisma generate 

RUN pnpm run build

EXPOSE 5500

CMD ["pnpm", "run", "start:prod"]