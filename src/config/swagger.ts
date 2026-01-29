import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Citas Médicas',
      version: '1.0.0',
      description: 'API REST para sistema de gestión de citas médicas. Permite gestionar clientes, citas, tipos de cita y autenticación de usuarios.',
      contact: {
        name: 'Soporte API',
        email: 'soporte@appointments.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}${env.api.prefix}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido del endpoint de login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Error message',
                },
                code: {
                  type: 'string',
                  example: 'ERROR_CODE',
                },
                details: {
                  type: 'object',
                },
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 100,
            },
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 10,
            },
            totalPages: {
              type: 'integer',
              example: 10,
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@appointments.com',
            },
            full_name: {
              type: 'string',
              example: 'Carlos Administrador',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user', 'receptionist'],
              example: 'admin',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            first_name: {
              type: 'string',
              example: 'Ana',
            },
            last_name: {
              type: 'string',
              example: 'García',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'ana.garcia@email.com',
            },
            phone: {
              type: 'string',
              example: '+51 987 654 321',
            },
            birth_date: {
              type: 'string',
              format: 'date',
              example: '1985-03-15',
            },
            address: {
              type: 'string',
              example: 'Av. Larco 1234, Miraflores',
            },
            preferred_contact: {
              type: 'string',
              enum: ['email', 'phone', 'whatsapp'],
              example: 'email',
            },
            notes: {
              type: 'string',
              example: 'Paciente regular',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ClientInput: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'phone'],
          properties: {
            first_name: {
              type: 'string',
              example: 'Juan',
            },
            last_name: {
              type: 'string',
              example: 'Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@email.com',
            },
            phone: {
              type: 'string',
              example: '+51 987 654 321',
            },
            birth_date: {
              type: 'string',
              format: 'date',
              example: '1990-05-20',
            },
            address: {
              type: 'string',
              example: 'Calle Los Pinos 123',
            },
            preferred_contact: {
              type: 'string',
              enum: ['email', 'phone', 'whatsapp'],
              example: 'whatsapp',
            },
            notes: {
              type: 'string',
              example: 'Cliente nuevo',
            },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            client_id: {
              type: 'string',
              format: 'uuid',
            },
            appointment_type_id: {
              type: 'string',
              format: 'uuid',
            },
            appointment_date: {
              type: 'string',
              format: 'date',
              example: '2025-02-15',
            },
            start_time: {
              type: 'string',
              example: '10:00:00',
            },
            end_time: {
              type: 'string',
              example: '10:30:00',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
              example: 'pending',
            },
            notes: {
              type: 'string',
              example: 'Primera consulta',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AppointmentInput: {
          type: 'object',
          required: ['client_id', 'appointment_type_id', 'appointment_date', 'start_time'],
          properties: {
            client_id: {
              type: 'string',
              format: 'uuid',
            },
            appointment_type_id: {
              type: 'string',
              format: 'uuid',
            },
            appointment_date: {
              type: 'string',
              format: 'date',
              example: '2025-02-15',
            },
            start_time: {
              type: 'string',
              example: '10:00:00',
            },
            notes: {
              type: 'string',
              example: 'Primera consulta',
            },
          },
        },
        AppointmentType: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'Consulta General',
            },
            description: {
              type: 'string',
              example: 'Consulta médica general',
            },
            duration_minutes: {
              type: 'integer',
              example: 30,
            },
            color: {
              type: 'string',
              example: '#4CAF50',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
          },
        },
        AppointmentTypeInput: {
          type: 'object',
          required: ['name', 'duration_minutes'],
          properties: {
            name: {
              type: 'string',
              example: 'Consulta Especializada',
            },
            description: {
              type: 'string',
              example: 'Consulta con especialista',
            },
            duration_minutes: {
              type: 'integer',
              example: 45,
            },
            color: {
              type: 'string',
              example: '#FF6B6B',
            },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@appointments.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación',
      },
      {
        name: 'Clients',
        description: 'Gestión de clientes',
      },
      {
        name: 'Appointments',
        description: 'Gestión de citas',
      },
      {
        name: 'Appointment Types',
        description: 'Gestión de tipos de cita',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
