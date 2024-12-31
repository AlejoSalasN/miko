# Miko

Miko es una aplicación para la gestión de tareas y áreas de trabajo, diseñada para ayudar a los usuarios a organizar proyectos de forma colaborativa y eficiente. Este repositorio contiene el backend implementado con Node.js y Fastify. Próximamente se añadirá el frontend.

## Estructura del Proyecto

```
miko/
|-- backend/
|   |-- config/       # Configuración de la base de datos y otros
|   |-- controllers/  # Lógica de negocio de las rutas
|   |-- models/       # Interacciones con la base de datos
|   |-- routes/       # Definición de rutas de la API
|   |-- server.js     # Configuración principal del servidor
|   |-- package.json  # Dependencias y scripts del backend
|   |-- .env          # Variables de entorno (no incluido en el repositorio)
|-- frontend/         # Carpeta para el frontend (vacía por ahora)
|-- README.md         # Documentación del proyecto
|-- .gitignore        # Archivos y carpetas ignorados por Git
```

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [PostgreSQL](https://www.postgresql.org/)

## Configuración del Backend

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/miko.git
   cd miko/backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la carpeta `backend`.
   - Añade las siguientes variables:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
     JWT_SECRET=tu_secreto_seguro
     EMAIL_USER=tucorreo@servidor.com
     EMAIL_PASSWORD=contraseña de aplicación
     ```

4. Inicia la base de datos:
   - Asegúrate de que PostgreSQL esté ejecutándose y que la base de datos esté configurada según el esquema SQL proporcionado.

5. Inicia el servidor:
   ```bash
   npm start
   ```

6. Prueba la API:
   - Usa herramientas como [Postman](https://www.postman.com/) o [Thunder Client](https://www.thunderclient.com/) para probar los endpoints.

## Endpoints Principales

### Usuarios
- **Registro:** `POST /register`
- **Inicio de Sesión:** `POST /login`

### Áreas de Trabajo
- **Crear:** `POST /workspaces`
- **Obtener todas:** `GET /workspaces`
- **Eliminar:** `DELETE /workspaces/:id`

### Columnas
- **Crear:** `POST /columns`
- **Obtener todas:** `GET /columns`
- **Eliminar:** `DELETE /columns/:id`

### Tareas
- **Crear:** `POST /columns/:columnId/tasks`
- **Mover:** `PATCH /tasks/:id/move`
- **Eliminar:** `DELETE /tasks/:id`

## Contribución

Si deseas contribuir a este proyecto:

1. Crea una rama nueva para tus cambios:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. Realiza tus cambios y haz commits:
   ```bash
   git commit -m "Descripción de los cambios"
   ```

3. Sube tus cambios a GitHub:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

4. Abre un Pull Request en GitHub.

## Licencia

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).


