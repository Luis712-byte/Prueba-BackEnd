# Backend - Servidor

Este es el backend de la aplicación, que proporciona la lógica de negocio y la gestión de datos. Está diseñado con **Node.js** y **Docker**.

## Requisitos

- **Node.js** (versión 18 o superior)
- **Docker** (para contenedores)
- **Postman** (para probar las API)

## Instalación
### Uso con Docker

Para utilizar Docker para ejecutar la aplicación, sigue estos pasos:

1. **Construir la imagen de Docker:**

   Si no tienes el repositorio clonado en tu máquina, primero clona el repositorio. Luego, en el directorio `backend`, construye la imagen de Docker con:

   ```bash
   docker-compose build
   ```
2. Levantar los contenedores con Docker Compose:**
    ```bash
   docker-compose up
   ```
Si necesitas correr los contenedores en segundo plano (modo detached), puedes agregar la opción -d:
  ```bash
   docker-compose up -d
   ```
Cuando se levante se va a ejecutar en el puerto 3000
   
   
