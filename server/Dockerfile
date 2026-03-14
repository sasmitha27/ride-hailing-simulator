# Multi-stage build for backend (Debian slim base to satisfy Prisma/OpenSSL dependencies)
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Install build-time deps
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	python3 \
	ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-bullseye-slim

WORKDIR /app

# Install runtime dependencies (minimal)
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
	&& npm ci --only=production \
	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy prisma files
COPY prisma ./prisma

# Generate Prisma Client for production
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

# Expose port 4000
EXPOSE 4000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
