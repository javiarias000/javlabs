# ═══════════════════════════════════════════════════════════════════════════
# JAV LABS - Backend Dockerfile
# ═══════════════════════════════════════════════════════════════════════════

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including dev for Prisma)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Builder (if needed for TypeScript compilation)
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# If using TypeScript, uncomment:
# RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code from builder (or directly if no build step)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY src ./src
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

# If you have a build step, copy dist instead:
# COPY --from=builder /app/dist ./dist

# Generate Prisma Client (in case it wasn't generated)
RUN npx prisma generate

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/index.js"]
