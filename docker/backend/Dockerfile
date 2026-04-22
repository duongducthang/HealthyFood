FROM node:20-alpine AS builder
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN npx prisma generate
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# --- RUN ---
FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["node", "dist/main.js"]