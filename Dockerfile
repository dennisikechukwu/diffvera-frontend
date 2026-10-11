# ==============================================================================
# Stage 1: Build Nuxt 4 Nitro Production Output
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /build

# Install dependencies first for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source files
COPY app/ app/
COPY public/ public/
COPY server/ server/
COPY nuxt.config.ts tsconfig.json eslint.config.mjs ./

# Build optimized production bundle (.output)
ENV NODE_ENV=production
RUN npm run build

# ==============================================================================
# Stage 2: Minimal Production Node 22 Runtime
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Run as built-in non-root 'node' user
USER node

# Copy compiled Nitro server and public assets
COPY --chown=node:node --from=builder /build/.output .output

# Production runtime networking configuration
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    NITRO_HOST=0.0.0.0 \
    PORT=3000 \
    NITRO_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
