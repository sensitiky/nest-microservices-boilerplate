FROM oven/bun:1.0 as builder

WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Copy workspace package.json files
COPY libs/common/package.json ./libs/common/
COPY libs/config/package.json ./libs/config/
COPY apps/gateway/package.json ./apps/gateway/
COPY apps/auth/package.json ./apps/auth/
COPY apps/user/package.json ./apps/user/
COPY apps/product/package.json ./apps/product/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build:all

# Production stage
FROM oven/bun:1.0-slim

WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Copy workspace package.json files
COPY libs/common/package.json ./libs/common/
COPY libs/config/package.json ./libs/config/
COPY apps/gateway/package.json ./apps/gateway/
COPY apps/auth/package.json ./apps/auth/
COPY apps/user/package.json ./apps/user/
COPY apps/product/package.json ./apps/product/

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN bun install --production

# Set environment variables
ENV NODE_ENV=production

# Expose ports
EXPOSE 3000 3001 3002 4001 4002

# Command to run the application
CMD ["bun", "run", "start"]
