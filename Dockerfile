FROM node:22-alpine AS base
ENV HUSKY=0
RUN corepack enable && corepack prepare npm@11.3.0 --activate

RUN apk add --no-cache python3~=3.12
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV CONFIG_PATH=${CONFIG_PATH}

EXPOSE 3000
CMD ["node", "dist/index.js"]