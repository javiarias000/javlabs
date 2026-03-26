# ═══════════════════════════════════════════════════════════════════════════
# JAV LABS - Frontend Dockerfile (Nginx)
# ═══════════════════════════════════════════════════════════════════════════

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine AS runner

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy custom nginx config (if exists) or use default
COPY nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx user
RUN addgroup -g 1001 -S nginxjs && \
    adduser -S nginxjs -u 1001

# Adjust permissions
RUN chown -R nginxjs:nginxjs /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
