# ---------- STAGE 1: Build frontend ----------
    FROM node:20 AS frontend-build
    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm ci
    COPY frontend/ ./
    RUN npm run build
    
    # ---------- STAGE 2: Backend ----------
    FROM node:20
    WORKDIR /app
    
    # Copiar backend package.json y package-lock.json
    COPY backend/package*.json ./backend/
    
    # Instalar dependencias de producción
    RUN cd backend && npm ci --omit=dev
    
    # Copiar Prisma schema y generar cliente
    COPY backend/prisma ./backend/prisma
    RUN cd backend && npx prisma generate
    
    # Copiar resto del backend
    COPY backend/ ./backend/
    
    # Copiar frontend build a /app/dist
    COPY --from=frontend-build /app/frontend/dist ./dist
    
    # Variables de entorno
    ENV PORT=3000
    
    EXPOSE 3000
    
    # Comando de inicio
    CMD ["sh", "-c", "cd backend && npx prisma db push --skip-generate && node prisma/seed.js && node src/index.js"]