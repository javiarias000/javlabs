/**
 * Swagger Configuration
 * Documentación de API para JAV LABS
 */

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'JAV LABS API',
    version: '1.0.0',
    description: 'API para el sistema de automatización JAV LABS',
    contact: {
      name: 'JAV LABS Support',
      email: 'hola@javlabs.com',
    },
    license: {
      name: 'Proprietary',
      url: 'https://javlabs.com/license',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Desarrollo',
    },
    {
      url: 'https://api.javlabs.com',
      description: 'Producción',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa tu token JWT en el formato: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', format: 'email', example: 'juan@empresa.com' },
          role: {
            type: 'string',
            enum: ['ADMIN', 'AGENT', 'CLIENT'],
            example: 'CLIENT',
          },
          company: { type: 'string', example: 'Mi Empresa S.L.' },
          phone: { type: 'string', example: '+34600000000' },
          isActive: { type: 'boolean', example: true },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-03-25T10:30:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-03-25T10:30:00Z',
          },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Automatización Ventas' },
          description: { type: 'string', example: 'Automatizar proceso de ventas' },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'],
            example: 'IN_PROGRESS',
          },
          progress: { type: 'integer', minimum: 0, maximum: 100, example: 45 },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time', nullable: true },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Automation: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Lead Scoring' },
          description: { type: 'string' },
          type: {
            type: 'string',
            enum: ['PROCESS', 'API_INTEGRATION', 'CHATBOT', 'CRM', 'REPORT', 'WORKFLOW'],
            example: 'CHATBOT',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'PAUSED', 'ERROR', 'PENDING'],
            example: 'ACTIVE',
          },
          tasksRun: { type: 'integer', example: 1520 },
          timeSaved: { type: 'number', format: 'float', example: 45.5 },
          projectId: { type: 'string' },
          webhookUrl: { type: 'string', format: 'url', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SupportTicket: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          subject: { type: 'string', example: 'Problema con integración' },
          description: { type: 'string' },
          status: {
            type: 'string',
            enum: ['AUTOMATED', 'HUMAN_TAKEOVER', 'PENDING_HUMAN', 'COMPLETED', 'CLOSED'],
            example: 'PENDING_HUMAN',
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            example: 'MEDIUM',
          },
          assignedAgentId: { type: 'string', nullable: true },
          lastMessageAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TicketMessage: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          ticketId: { type: 'string' },
          senderType: {
            type: 'string',
            enum: ['USER', 'BOT', 'AGENT'],
            example: 'USER',
          },
          senderId: { type: 'string', nullable: true },
          content: { type: 'string', example: 'Necesito ayuda con...' },
          metadata: {
            type: 'object',
            nullable: true,
            example: { confidence: 0.95, sources: ['doc1', 'doc2'] },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ContactForm: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Carlos Ruiz' },
          company: { type: 'string', example: 'TechCorp' },
          email: { type: 'string', format: 'email', example: 'carlos@techcorp.com' },
          phone: { type: 'string', example: '+34600000000' },
          service: { type: 'string', example: 'Automatización de Procesos' },
          message: { type: 'string', example: 'Me interesa saber más sobre...' },
          status: {
            type: 'string',
            enum: ['PENDING', 'READ', 'REPLIED', 'CLOSED'],
            example: 'PENDING',
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'usuario@empresa.com' },
          password: { type: 'string', format: 'password', example: 'MiPassword123' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', format: 'email', example: 'juan@empresa.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'MiPassword123',
            minLength: 8,
            description: 'Mínimo 8 caracteres, al menos una mayúscula y un número',
          },
          company: { type: 'string', example: 'Mi Empresa S.L.' },
          phone: { type: 'string', example: '+34600000000' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'VALIDATION_ERROR' },
          message: { type: 'string', example: 'Datos de entrada inválidos' },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'No autorizado - Token inválido o faltante',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'UNAUTHORIZED' },
                message: { type: 'string', example: 'Token no proporcionado o inválido' },
              },
            },
          },
        },
      },
      Forbidden: {
        description: 'Prohibido - No tienes permisos para este recurso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'FORBIDDEN' },
                message: { type: 'string', example: 'No tienes permisos para acceder a este recurso' },
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'NOT_FOUND' },
                message: { type: 'string', example: 'El recurso solicitado no existe' },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Error de validación de datos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      ServerError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
                message: { type: 'string', example: 'Ha ocurrido un error inesperado' },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Endpoint de salud del servicio',
    },
    {
      name: 'Auth',
      description: 'Autenticación y autorización',
    },
    {
      name: 'Users',
      description: 'Gestión de usuarios (solo admin)',
    },
    {
      name: 'Projects',
      description: 'Proyectos de automatización',
    },
    {
      name: 'Automations',
      description: 'Automatizaciones',
    },
    {
      name: 'Contact',
      description: 'Formulario de contacto',
    },
    {
      name: 'Dashboard',
      description: 'Estadísticas y dashboard',
    },
    {
      name: 'Support',
      description: 'Sistema de tickets de soporte',
    },
    {
      name: 'Webhooks',
      description: 'Webhooks配置',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Ruta a los archivos con anotaciones de Swagger
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/middlewares/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi,
};
