# ---------- STAGE 1: Build frontend ----------
    FROM node:20 AS frontend-build
    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend/ ./
    RUN npm run build
    
    # ---------- STAGE 2: Backend ----------
    FROM node:20
    WORKDIR /app
    
    # Copiar package.json y package-lock.json del backend
    COPY backend/package*.json ./backend/
    
    # Instalar dependencias de producción
    RUN cd backend && npm install --production
    
    # 🔹 Copiar el prisma schema antes de generar el cliente
    COPY backend/prisma ./backend/prisma
    
    # Generar cliente Prisma
    RUN cd backend && npx prisma generate
    
    # Copiar el resto del backend
    COPY backend/ ./backend/
    
    # Copiar build del frontend
    COPY --from=frontend-build /app/frontend/dist ./backend/dist
    
    # Variables de entorno opcionales
    ENV PORT=3000
    
    EXPOSE 3000
    
    # Comando de inicio
    CMD ["node", "backend/src/index.js"]