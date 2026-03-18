# ---------- STAGE 1: Build frontend ----------
    FROM node:20 AS frontend-build

    # Directorio de trabajo
    WORKDIR /app/frontend
    
    # Copiar package.json y package-lock.json
    COPY frontend/package*.json ./
    
    # Instalar dependencias frontend
    RUN npm install
    
    # Copiar el código frontend
    COPY frontend/ ./
    
    # Construir frontend (dist/)
    RUN npm run build
    
    # ---------- STAGE 2: Backend ----------
    FROM node:20
    
    WORKDIR /app
    
    # Copiar package.json y package-lock.json de backend
    COPY backend/package*.json ./backend/
    
    # Instalar solo dependencias de producción
    RUN cd backend && npm install --production
    
    # Copiar código backend
    COPY backend/ ./backend/
    
    # Copiar build del frontend desde stage anterior
    COPY --from=frontend-build /app/frontend/dist ./backend/dist
    
    # Variables de entorno opcionales por defecto (se pueden sobreescribir con .env)
    ENV PORT=3000
    
    # Exponer puerto
    EXPOSE 3000
    
    # Comando de inicio
    CMD ["node", "backend/src/index.js"]