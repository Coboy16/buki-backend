# Buki Backend - API de Gestión de Citas Médicas

API REST profesional construida con Node.js, TypeScript, Express y MySQL para la gestión de citas médicas.

## Tecnologías

- **Node.js 20** + **TypeScript**
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **JWT** - Autenticación
- **Joi** - Validación de datos
- **Swagger/OpenAPI** - Documentación
- **Docker** - Containerización

## Requisitos

- Node.js 20+
- MySQL 8.0+
- Docker (opcional)

## Instalación

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/Coboy16/buki-backend.git
cd buki-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

### Con Docker

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f api
```

### Usando la imagen de GitHub Container Registry

```bash
# Pull de la imagen
docker pull ghcr.io/coboy16/buki-backend:latest

# Ejecutar
docker run -d \
  -p 3000:3000 \
  -e DB_HOST=your_db_host \
  -e DB_PORT=3306 \
  -e DB_NAME=your_db_name \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e JWT_SECRET=your_jwt_secret \
  ghcr.io/coboy16/buki-backend:latest
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecutar en modo desarrollo |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar versión compilada |
| `npm run seed` | Crear usuario admin de prueba |

## Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesión |
| POST | `/api/v1/auth/register` | Registrar usuario (admin) |
| GET | `/api/v1/auth/me` | Obtener perfil |

### Clientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/clients` | Listar clientes |
| GET | `/api/v1/clients/:id` | Obtener cliente |
| POST | `/api/v1/clients` | Crear cliente |
| PUT | `/api/v1/clients/:id` | Actualizar cliente |
| DELETE | `/api/v1/clients/:id` | Eliminar cliente |

### Citas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/appointments` | Listar citas |
| GET | `/api/v1/appointments/:id` | Obtener cita |
| POST | `/api/v1/appointments` | Crear cita |
| PUT | `/api/v1/appointments/:id` | Actualizar cita |
| PATCH | `/api/v1/appointments/:id/status` | Cambiar estado |
| DELETE | `/api/v1/appointments/:id` | Eliminar cita |

### Tipos de Cita
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/appointment-types` | Listar tipos |
| POST | `/api/v1/appointment-types` | Crear tipo (admin) |
| PUT | `/api/v1/appointment-types/:id` | Actualizar tipo (admin) |
| DELETE | `/api/v1/appointment-types/:id` | Eliminar tipo (admin) |

## Documentación API

Swagger UI disponible en: `http://localhost:3000/api/v1/docs`

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | development |
| `PORT` | Puerto del servidor | 3000 |
| `DB_HOST` | Host de MySQL | localhost |
| `DB_PORT` | Puerto de MySQL | 3306 |
| `DB_NAME` | Nombre de la BD | - |
| `DB_USER` | Usuario de MySQL | - |
| `DB_PASSWORD` | Contraseña de MySQL | - |
| `JWT_SECRET` | Secreto para JWT | - |
| `JWT_EXPIRES_IN` | Expiración del token | 24h |
| `CORS_ORIGIN` | Origen permitido CORS | * |

## Estructura del Proyecto

```
src/
├── config/          # Configuraciones (DB, Swagger, ENV)
├── controllers/     # Controladores HTTP
├── middlewares/     # Middlewares (auth, validation, errors)
├── models/          # Modelos Sequelize
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
├── utils/           # Utilidades
├── validators/      # Esquemas de validación Joi
├── app.ts           # Configuración Express
└── server.ts        # Punto de entrada
```

## CI/CD

El proyecto usa GitHub Actions para:
- Compilar y validar el código TypeScript
- Construir imagen Docker
- Publicar en GitHub Container Registry (GHCR)

## Licencia

ISC
