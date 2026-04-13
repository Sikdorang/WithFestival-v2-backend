FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN DATABASE_URL="mysql://build:build@127.0.0.1:3306/build" npx prisma generate
RUN npm run build

FROM node:20 AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production \
  && npm install prisma@7.7.0 --no-save

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN DATABASE_URL="mysql://generate:generate@127.0.0.1:3306/generate" npx prisma generate

COPY scripts/container-entrypoint.sh /usr/local/bin/container-entrypoint.sh
RUN chmod +x /usr/local/bin/container-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/container-entrypoint.sh"]
CMD []