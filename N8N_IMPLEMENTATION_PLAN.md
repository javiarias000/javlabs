
# 🚀 PLAN DE IMPLEMENTACIÓN - n8n Integration

**Fecha:** 2026-03-25
**Estado:** Parcialmente implementado, requiere configuración y pruebas
**Objetivo:** Integración completa de n8n para automatizaciones y chatbot de soporte

---

## 📊 ESTADO ACTUAL

### ✅ Ya Implementado (Backend)

1. **Variables de entorno** configuradas en `.env`:
   - `N8N_URL=https://n8n-n8n.ak7rlh.easypanel.host`
   - `N8N_API_KEY=eyJhbGciOiJIUzI1NiIs...`
   - `N8N_SUPPORT_WEBHOOK_URL` configurado

2. **Rutas API n8n** (`backend/src/routes/n8n.routes.js`):
   - `GET /api/n8n/workflows` - Listar workflows
   - `GET /api/n8n/workflows/:id` - Obtener workflow específico
   - `POST /api/n8n/workflows` - Crear workflow
   - `PATCH /api/n8n/workflows/:id/activate` - Activar workflow
   - `PATCH /api/n8n/workflows/:id/deactivate` - Desactivar workflow
   - `GET /api/n8n/projects` - Lista proyectos agrupados (con lógica de detección)
   - `GET /api/n8n/projects/:key` - Detalles de proyecto específico
   - `PATCH /api/n8n/projects/:key` - Guardar configuración de proyecto
   - `GET /api/n8n/executions` - Listar ejecuciones con filtros
   - `GET /api/n8n/stats` - Estadísticas generales

3. **Integración en Dashboard** (`dashboard.controller.js`):
   - Obtiene estadísticas de n8n (executions, workflows, success rate)
   - Filtrado por proyecto (`n8nProjectKey`) para usuarios no-admin
   - Manejo de errores gracefully (no falla si n8n no responde)
   - Lógica de agrupación por proyecto (PROJECT_RULES)

4. **Soporte Chatbot** (`support.routes.js`):
   - Webhook público `/api/support/tickets/:id/webhook-n8n` para recibir respuestas
   - Webhook público `/api/support/tickets/:id/public` para que n8n lea tickets
   - Notificación automática a n8n cuando usuario envía mensaje (modo AUTOMATED)
   - Workflow documentado en `support_n8n_workflow.json`

5. **Modelo en Prisma**:
   ```prisma
   model N8nProject {
     key         String   @id
     name        String?
     description String?
     color       String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

6. **Frontend**:
   - `ProjectDetailView.jsx` con integración n8n (workflows, activación/desactivación)
   - `support.js` service con método `n8nWebhook()`
   - Navegación a interfaz n8n externa

---

### ❌ Problemas Identificados

1. **Swagger JSDoc errors** en `n8n.routes.js` impiden que backend arranque
2. **`produces` field** en Swagger (obsoleto en OpenAPI 3.0) → usar solo `content`
3. **Indentación/espaciado** en anotaciones JSDoc (YAML parser es delicado)
4. **URLs hardcodeadas** en frontend (`ProjectDetailView.jsx`):
   - `https://n8n-n8n.ak7rlh.easypanel.host` → debería usar variable env
5. **Modelo `N8nProject` noMigrado**:
   - Schema existe pero migrations/seed no están sincronizados
6. **CORS para n8n**:
   - n8n hace llamadas server-to-server NO debería estar en CORS allowlist
7. **Variables de entorno**:
   - `N8N_URL` debe ser configurable por entorno (dev/staging/prod)
   - `N8N_API_KEY` debe venir de credenciales seguras (no hardcodeada)

---

## 🎯 PLAN DE ACCIÓN COMPLETO

### FASE 1: Corregir Errores Críticos (Backend) ⚡

**Tiempo estimado:** 1-2 horas

#### 1.1. Arreglar Swagger en `n8n.routes.js`
- Eliminar `produces:` (solo usar `content:` en OpenAPI 3.0)
- Asegurar indentación consistente (2 espacios después de `*`)
- Quitar caracteres `:` problemáticos en descripciones
- **Responsable:** Backend
- **Archivo:** `backend/src/routes/n8n.routes.js`

#### 1.2. Sincronizar Prisma
```bash
cd backend
npx prisma migrate dev --name add_n8n_project_model
# O si ya existe el modelo pero no migrado:
npx prisma generate
```
- Verificar que `N8nProject` esté en `schema.prisma`
- **Responsable:** Backend

#### 1.3. Limpiar variables de entorno
- Mover `N8N_URL`, `N8N_API_KEY` a `.env.production` con valores reales
- En desarrollo usar `http://localhost:5678` (docker n8n) o URL de staging
- **Responsable:** DevOps

---

### FASE 2: Configuración n8n (Workflows) ⚙️

**Tiempo estimado:** 2-3 horas

#### 2.1. Desplegar Workflow de Soporte
1. Acceder a n8n UI: `https://n8n-n8n.ak7rlh.easypanel.host`
2. Importar `support_n8n_workflow.json`
3. Configurar credenciales:
   - **OpenAI API Key** (o usar modelo local)
   - **Backend API** → credenciales JWT para llamar `/api/support/tickets/:id/webhook-n8n`
4. Activar workflow (`active: true`)
5. Probar flujo completo:
   - Crear ticket (POST `/api/support/tickets` con `status: AUTOMATED`)
   - Enviar mensaje como usuario
   - Verificar que n8n reciba webhook y responda

#### 2.2. Configurar Webhook de n8n → Backend
- En n8n, crear webhook para `support-response` (si no se crea automáticamente)
- Verificar que `N8N_SUPPORT_WEBHOOK_URL` apunte a: `https://javlabs-javlabs-backend.ak7rlh.easypanel.host/api/support/tickets/{{ticketId}}/webhook-n8n`
- Probar con Postman/curl:
  ```bash
  curl -X POST https://n8n-n8n.ak7rlh.easypanel.host/webhook/support-response \
    -H "Content-Type: application/json" \
    -d '{"ticketId":"XXX","message":"test"}'
  ```

#### 2.3. Configurar PROJECT_RULES en Dashboard
- Decidir reglas de detección de proyectos (keywords)
- Mover a base de datos (`N8nProject`) en lugar de hardcoded
- UI para administrador editar reglas

---

### FASE 3: Frontend - Panel de Control n8n 🖥️

**Tiempo estimado:** 3-4 horas

#### 3.1. Variables de entorno frontend
- Crear `frontend/.env.development` y `production`
- `VITE_N8N_URL=https://n8n-n8n.ak7rlh.easypanel.host`
- **Responsable:** Frontend

#### 3.2. Usar variable en `ProjectDetailView.jsx`
- Reemplazar `const N8N_URL = 'https://...'` con `import.meta.env.VITE_N8N_URL`
- Agregar fallback a valor por defecto si no definido

#### 3.3. Mejorar UI de n8n en ProjectDetailView
- Mostrar workflows del proyecto actual (filtrados por `n8nProjectKey`)
- Botones para activar/desactivar workflows individuales
- Estadísticas de ejecuciones (success rate, avg time)
- Link directo a workflow en n8n UI (`/workflow/${id}`)

#### 3.4. Nueva página: n8n Admin Dashboard
- Ruta: `/admin/n8n` (solo ADMIN)
- Listar todos los workflows con estado
- Ver ejecuciones recientes con errores
- Estadísticas globales (total execs, success rate)
- Botones para activar/desactivar workflows masivamente

---

### FASE 4: Pruebas y Validación 🧪

**Tiempo estimado:** 2-3 horas

#### 4.1. Backend Tests
- **Unit tests:** Mock de axios n8n client
- **Integration tests:** Probar `/api/n8n/*` endpoints con mock server
- **E2E:** Probar flujo completo de ticket → n8n → respuesta backen

#### 4.2. Frontend Tests
- Verificar que `ProjectDetailView` carga workflows correctamente
- Probar activación/desactivación de workflows
- Test de errores (n8n down, 500 errors)

#### 4.3. Pruebas manuales (Checklist)
- [ ] Backend arranca sin errores Swagger
- [ ] `GET /api/n8n/workflows` responde correctamente
- [ ] `GET /api/dashboard` incluye `n8nStats`
- [ ] Crear ticket → n8n recibe webhook → responde bot
- [ ] Frontend muestra workflows de proyecto
- [ ] Activar/desactivar workflow desde frontend funciona
- [ ] Logs de errores n8n se manejan correctamente

---

### FASE 5: Producción y Monitoreo 📈

**Tiempo estimado:** 1-2 horas

#### 5.1. Variables de entorno producción
- `N8N_URL` apuntando a instancia producción de n8n
- `N8N_API_KEY` desde secrets manager
- `N8N_SUPPORT_WEBHOOK_URL` con dominio público

#### 5.2. Health Checks
- Agregar `/health/n8n` que verifique conexión a n8n
- Mostrar estado en `GET /health`

#### 5.3. Logging
- Logs de llamadas a n8n (requests, responses, errors)
- Incluir `workflowId`, `executionId` en logs

#### 5.4. Alertas
- Alertar si n8n lleva >5min sin responder
- Alertar si error rate >10% en ejecuciones

---

## 📋 REQUISITOS PREVIOS

### n8n Instance
- [ ] n8n desplegado (Docker/Easypanel/K8s)
- [ ] API key generada (`N8N_API_KEY`)
- [ ] Workflow de soporte importado y activado
- [ ] Credenciales OpenAI configuradas en n8n

### Backend
- [ ] Modelo `N8nProject` migrado en Prisma
- [ ] Variables de entorno configuradas
- [ ] CORS no bloquea llamadas server-to-server

### Frontend
- [ ] Variable `VITE_N8N_URL` configurada
- [ ] Ruta `/project/:id` muestra pestaña n8n

---

## 🔧 COMANDOS ÚTILES

```bash
# Regenerar Prisma client
cd backend
npx prisma generate

# Ejecutar migrations
npx prisma migrate dev

# Probar n8n connection desde backend
curl -H "X-N8N-API-KEY: tu_api_key" \
  https://n8n-n8n.ak7rlh.easypanel.host/api/v1/workflows

# Probar webhook de soporte
curl -X POST https://n8n-n8n.ak7rlh.easypanel.host/webhook/support-response \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"<UUID>","message":"test"}'
```

---

## 📞 CONTACTO Y SEGUIMIENTO

**Responsables:**
- Backend: JAV
- Frontend: JAV
- DevOps: JAV

**Próxima revisión:** Después de completar FASE 1

---

**Documento creado:** 2026-03-25
**Última actualización:** 2026-03-25
