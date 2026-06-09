# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY forms-spravka/package.json forms-spravka/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY forms-spravka/ .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY forms-spravka/package.json forms-spravka/package-lock.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY forms-spravka/electron-main.cjs ./

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "dist/server.cjs"]
