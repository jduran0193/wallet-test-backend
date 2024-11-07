# Wallet API

## Descripción

API para gestión de billetera digital construida con NestJS y MongoDB.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18 o superior)
- MongoDB
- Yarn

## Configuración del Proyecto

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

2. **Instalar dependencias**

```bash
yarn install
```

3. **Configurar variables de entorno**

- Copia el archivo `.env.example` a `.env`

```bash
cp .env.example .env
```

- Ajusta las variables en el archivo `.env`:

  ```
  # Server
  PORT=6100                                    # Puerto del servidor

  # Database
  MONGODB_URI=mongodb://localhost:27017/wallet # URL de conexión a MongoDB

  # Email Configuration
  EMAIL_HOST=smtp.gmail.com                    # Servidor SMTP
  EMAIL_PORT=587                               # Puerto SMTP
  EMAIL_SECURE=false                           # Conexión segura
  EMAIL_USER=your-email@gmail.com              # Tu email
  EMAIL_PASSWORD=your-app-password             # Contraseña de aplicación
  EMAIL_FROM=your-email@gmail.com              # Email remitente
  ```

## Ejecutar el Proyecto

### Desarrollo

```bash
# Modo desarrollo
yarn start

# Modo desarrollo con hot-reload
yarn start:dev
```

## Estructura del Proyecto

```
src/
├── api/                          # Módulos relacionados con la API
│   ├── controllers/              # Controladores de la API
│   │   └── wallet.controller.ts  # Controlador para operaciones de wallet
│   ├── services/                 # Servicios de la API
│   │   └── wallet.service.ts     # Servicio para lógica de negocio del wallet
│   └── api.module.ts             # Módulo principal de la API
│
├── common/                       # Recursos compartidos
│   ├── dto/                      # Data Transfer Objects
│   │   └── client.dto.ts        # DTOs para el cliente
│   └── enums/                    # Enums compartidos
│   │   └── error-codes.enum.ts  # Enums para códigos de error
│   └── interfaces/              # Interfaces compartidas
│
├── config/                       # Configuraciones del proyecto
│
├── database/                     # Capa de base de datos
│   ├── schemas/                  # Esquemas de MongoDB
│   │   ├── client.schema.ts     # Esquema para clientes
│   │   └── wallet.schema.ts     # Esquema para wallet
│   ├── services/                 # Servicios de base de datos
│   │   └── database.service.ts  # Servicio para operaciones de DB
│   └── database.module.ts       # Módulo de configuración de DB
│
├── app.controller.ts            # Controlador principal
├── app.module.ts               # Módulo raíz de la aplicación
├── app.service.ts             # Servicio principal
└── main.ts                    # Punto de entrada de la aplicación
```

### Descripción de los Componentes Principales

#### API (`/api`)

- **Controllers**: Manejan las peticiones HTTP y respuestas
- **Services**: Contienen la lógica de negocio
- **api.module.ts**: Configura y exporta los componentes de la API

#### Common (`/common`)

- **DTOs**: Objetos para transferencia de datos entre capas
- **Interfaces**: Definiciones de tipos compartidos

#### Database (`/database`)

- **Schemas**: Definiciones de modelos de MongoDB
- **Services**: Servicios para interactuar con la base de datos
- **database.module.ts**: Configuración de conexión a MongoDB

#### Config (`/config`)

- Archivos de configuración para diferentes entornos

#### Archivos Raíz

- **main.ts**: Punto de entrada que inicia la aplicación
- **app.module.ts**: Módulo principal que organiza la aplicación
- **app.controller.ts**: Controlador base
- **app.service.ts**: Servicio base

## API Endpoints - Wallet Service

### Registro de Cliente

```http
POST /wallet/register
```

**Body:**

```json
{
  "document": "string", // Documento de identificación
  "name": "string", // Nombre completo
  "email": "string", // Correo electrónico
  "phone": "string" // Número de teléfono
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Cliente registrado exitosamente",
  "data": {
    "_id": "string",
    "document": "string",
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### Recargar Billetera

```http
POST /wallet/recharge
```

**Body:**

```json
{
  "document": "string", // Documento de identificación
  "phone": "string", // Número de teléfono
  "amount": 100 // Monto a recargar (número positivo)
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Recarga realizada exitosamente",
  "data": {
    "balance": 100
  }
}
```

### Iniciar Pago

```http
POST /wallet/payment
```

**Body:**

```json
{
  "document": "string", // Documento de identificación
  "phone": "string", // Número de teléfono
  "amount": 50 // Monto a pagar (número positivo)
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Token guardado exitosamente",
  "data": {
    "sessionId": "string",
    "token": "string",
    "tokenExpiration": "date"
  }
}
```

### Confirmar Pago

```http
POST /wallet/confirm-payment
```

**Body:**

```json
{
  "sessionId": "string", // ID de sesión generado
  "token": "string", // Token de confirmación
  "amount": 50 // Monto a confirmar (número positivo)
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Pago confirmado exitosamente",
  "data": {
    "newBalance": 50
  }
}
```

### Consultar Saldo

```http
GET /wallet/balance
```

**Query Parameters:**

- `document`: Documento de identificación del cliente
- `phone`: Número de teléfono del cliente

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Balance consultado exitosamente",
  "data": {
    "balance": 50
  }
}
```

### Códigos de Estado HTTP

- `200 OK`: Petición exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en los datos enviados
- `404 Not Found`: Cliente o wallet no encontrado
- `500 Internal Server Error`: Error interno del servidor

### Códigos de Error

```typescript
enum ErrorCode {
  CLIENT_EXISTS = 'CLIENT_EXISTS', // Cliente ya registrado
  CLIENT_NOT_FOUND = 'CLIENT_NOT_FOUND', // Cliente no encontrado
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND', // Billetera no encontrada
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS', // Fondos insuficientes
  INVALID_TOKEN = 'INVALID_TOKEN', // Token inválido o expirado
  INTERNAL_ERROR = 'INTERNAL_ERROR', // Error interno del servidor
}
```

Ejemplo de respuesta de error:

```json
{
  "success": false,
  "message": "Error message",
  "error": "CLIENT_NOT_FOUND"
}
```

### Notas Importantes

- Todos los campos marcados son obligatorios
- Los montos deben ser números positivos
- El token de confirmación tiene una validez de 5 minutos
- Los números de teléfono y documentos deben ser únicos en el sistema

## Contacto

[Jesus Duran] - [jdweb01@gmail.com]
