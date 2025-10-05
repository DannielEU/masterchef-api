# MasterChef API

API REST para la aplicación MasterChef, construida con NestJS, MongoDB y TypeScript.

## Descripción

Este proyecto es una API para gestionar recetas, usuarios y funcionalidades relacionadas con el ecosistema MasterChef. Utiliza el framework [NestJS](https://github.com/nestjs/nest) con TypeScript y MongoDB como base de datos.

## Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- MongoDB (local o en la nube)

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```env
# MongoDB
MONGODB_URI=tu_conexion_mongodb

# Puerto de la aplicación
PORT=3000

# Otras configuraciones necesarias
```

## Ejecutar el proyecto

### Modo desarrollo
```bash
npm run start:dev
```

### Modo producción
```bash
# Compilar el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

### Otros comandos disponibles
```bash
# Desarrollo sin watch mode
npm start

# Modo debug
npm run start:debug
```

## API Documentation (Swagger)

La documentación interactiva de la API está disponible en Swagger:

- **Producción (Azure)**: [https://masterchef-api-guf0gvg6c8ebdkbm.canadacentral-01.azurewebsites.net/api](https://masterchef-api-guf0gvg6c8ebdkbm.canadacentral-01.azurewebsites.net/api)
- **Local**: `http://localhost:3000/api` (cuando corras el proyecto localmente)

## Endpoints principales

### Autenticación (`/auth`)

#### POST `/auth/register` - Registrar usuario
**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123",
  "nombre": "Juan Pérez",
  "rol": "participante",
  "temporada": "507f1f77bcf86cd799439011"
}
```
**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "rol": "participante",
  "temporada": "507f1f77bcf86cd799439011"
}
```

#### POST `/auth/login` - Iniciar sesión
**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123"
}
```
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "rol": "participante",
  "temporada": "507f1f77bcf86cd799439011"
}
```

---

### Temporadas (`/temporada`)

#### POST `/temporada` - Crear temporada
**Request:**
```json
{
  "nombre": "MasterChef España 2024",
  "temporada": 12
}
```
**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "MasterChef España 2024",
  "temporada": 12
}
```

#### GET `/temporada` - Listar temporadas
**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "MasterChef España 2024",
    "temporada": 12
  }
]
```

#### GET `/temporada/:id` - Obtener temporada por ID
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "MasterChef España 2024",
  "temporada": 12
}
```

#### DELETE `/temporada/:id` - Eliminar temporada
**Response (200):**
```json
{
  "mensaje": "Temporada eliminada exitosamente",
  "temporada": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "MasterChef España 2024",
    "temporada": 12
  }
}
```

---

###  Recetas (`/recetas`)

#### POST `/recetas` - Crear receta
**Request:**
```json
{
  "nombre": "Paella Valenciana",
  "descripcion": "Receta tradicional de paella valenciana con pollo y conejo",
  "ingredientes": ["arroz", "pollo", "conejo", "judías verdes", "garrofón", "tomate", "azafrán"],
  "pasos": [
    "Sofreír el pollo y conejo",
    "Añadir las verduras",
    "Agregar el arroz y el caldo",
    "Cocinar 18 minutos"
  ],
  "tiempoPreparacion": 60,
  "temporadaId": "507f1f77bcf86cd799439011",
  "creadoPorId": "507f1f77bcf86cd799439022"
}
```
**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439033",
  "nombre": "Paella Valenciana",
  "descripcion": "Receta tradicional de paella valenciana con pollo y conejo",
  "ingredientes": ["arroz", "pollo", "conejo", "judías verdes", "garrofón", "tomate", "azafrán"],
  "pasos": [
    "Sofreír el pollo y conejo",
    "Añadir las verduras",
    "Agregar el arroz y el caldo",
    "Cocinar 18 minutos"
  ],
  "tiempoPreparacion": 60,
  "temporadaId": "507f1f77bcf86cd799439011",
  "creadoPorId": "507f1f77bcf86cd799439022"
}
```

#### GET `/recetas` - Listar recetas (con filtros opcionales)
**Query params:**
- `creadoPorId`: ID del usuario creador
- `rol`: Rol del usuario (chef, participante)
- `ingrediente`: Buscar por ingrediente
- `temporadaId`: ID de la temporada

**Ejemplos:**
- `/recetas` - Todas las recetas
- `/recetas?ingrediente=pollo` - Recetas con pollo
- `/recetas?temporadaId=507f1f77bcf86cd799439011` - Recetas de una temporada

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439033",
    "nombre": "Paella Valenciana",
    "descripcion": "Receta tradicional de paella valenciana con pollo y conejo",
    "ingredientes": ["arroz", "pollo", "conejo", "judías verdes", "garrofón", "tomate", "azafrán"],
    "pasos": ["..."],
    "tiempoPreparacion": 60,
    "temporadaId": {...},
    "creadoPorId": {...}
  }
]
```

#### GET `/recetas/:id` - Obtener receta por ID
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439033",
  "nombre": "Paella Valenciana",
  "descripcion": "Receta tradicional de paella valenciana con pollo y conejo",
  "ingredientes": ["arroz", "pollo", "conejo", "judías verdes", "garrofón", "tomate", "azafrán"],
  "pasos": [
    "Sofreír el pollo y conejo",
    "Añadir las verduras",
    "Agregar el arroz y el caldo",
    "Cocinar 18 minutos"
  ],
  "tiempoPreparacion": 60,
  "temporadaId": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "MasterChef España 2024",
    "temporada": 12
  },
  "creadoPorId": {
    "_id": "507f1f77bcf86cd799439022",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "participante"
  }
}
```

#### PATCH `/recetas/:id` - Actualizar receta
**Request:**
```json
{
  "nombre": "Paella Valenciana Mejorada",
  "tiempoPreparacion": 75
}
```
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439033",
  "nombre": "Paella Valenciana Mejorada",
  "descripcion": "Receta tradicional de paella valenciana con pollo y conejo",
  "ingredientes": ["arroz", "pollo", "conejo", "judías verdes", "garrofón", "tomate", "azafrán"],
  "pasos": ["..."],
  "tiempoPreparacion": 75,
  "temporadaId": "507f1f77bcf86cd799439011",
  "creadoPorId": "507f1f77bcf86cd799439022"
}
```

#### DELETE `/recetas/:id` - Eliminar receta
**Response (200):**
```json
{
  "mensaje": "Receta eliminada exitosamente",
  "receta": {
    "_id": "507f1f77bcf86cd799439033",
    "nombre": "Paella Valenciana",
    "descripcion": "...",
    "ingredientes": ["..."],
    "pasos": ["..."]
  }
}
```

## Testing

```bash
# Unit tests
npm run test

# Tests en modo watch
npm run test:watch

# E2E tests
npm run test:e2e

# Cobertura de tests
npm run test:cov

# Debug tests
npm run test:debug
```

## Linting y Formateo

```bash
# Ejecutar ESLint
npm run lint

# Formatear código con Prettier
npm run format
```

## Tecnologías utilizadas

- **Framework**: NestJS 11
- **Base de datos**: MongoDB + Mongoose
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: bcrypt
- **Testing**: Jest
- **Lenguaje**: TypeScript

## Estructura del proyecto

```
src/
├── modules/         # Módulos de la aplicación
├── common/          # Utilidades y recursos compartidos
├── config/          # Configuración de la aplicación
└── main.ts          # Punto de entrada
```

## Deployment

El proyecto está desplegado en Azure App Service:

**URL de producción**: https://masterchef-api-guf0gvg6c8ebdkbm.canadacentral-01.azurewebsites.net/api

## Licencia

Este proyecto es privado y no cuenta con licencia open source.
