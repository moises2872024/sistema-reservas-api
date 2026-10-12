# Sistema de Reservas API

## 1. Descripción del proyecto

**Sistema de Reservas API** es una API REST desarrollada con Node.js y Express que permite administrar servicios y reservas.

La aplicación permite crear, consultar, actualizar y eliminar servicios, crear reservas y asociar servicios a una reserva. Los datos se almacenan en archivos JSON mediante el módulo File System (`fs`) de Node.js.

## 2. Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para desarrollar la API REST.
- **File System (`fs`):** módulo utilizado para leer y escribir archivos.
- **JSON:** formato utilizado para almacenar los datos.
- **Postman:** herramienta para probar los endpoints HTTP.

## 3. Requisitos previos

Para ejecutar el proyecto necesitas:

- Node.js instalado.
- npm, incluido con Node.js.
- Un editor de código, como Visual Studio Code.
- Postman u otra herramienta para realizar solicitudes HTTP.

## 4. Instalación y ejecución

### Clonar o descargar el proyecto

Abre una terminal en la carpeta raíz del proyecto:

```bash
cd sistema-reservas-api
```

### Instalar las dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

### Ejecutar en modo normal

```bash
npm start
```

Cuando el servidor se inicie correctamente, estará disponible en:

`http://localhost:3000`

## 5. Estructura del proyecto

```
sistema-reservas-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── env.config.js
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   └── data/
│       ├── services.json
│       └── bookings.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Descripción de los archivos principales

- `src/app.js`: configura Express, el middleware JSON, las rutas y el manejo de errores.
- `src/server.js`: inicia el servidor HTTP.
- `src/config/env.config.js`: configura el puerto del servidor.
- `src/managers/ServiceManager.js`: contiene la lógica de administración de servicios y su persistencia.
- `src/managers/BookingManager.js`: contiene la lógica de creación y consulta de reservas, y de asociación de servicios.
- `src/routes/services.router.js`: define los endpoints de servicios y sus validaciones.
- `src/routes/bookings.router.js`: define los endpoints de reservas y la asociación de servicios.
- `src/data/services.json`: almacena los servicios.
- `src/data/bookings.json`: almacena las reservas.
- `package.json`: define los scripts y las dependencias del proyecto.

## 6. Endpoints de servicios

La ruta base es:

`/api/services`

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtiene todos los servicios. |
| GET | `/api/services/:id` | Obtiene un servicio por su ID. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:id` | Actualiza un servicio existente. |
| DELETE | `/api/services/:id` | Elimina un servicio. |

### Crear un servicio

**Solicitud:**

`POST http://localhost:3000/api/services`

En Postman, selecciona `Body → raw → JSON` e introduce:

```json
{
  "name": "Corte de cabello",
  "description": "Corte de cabello tradicional",
  "duration": 30,
  "price": 8000,
  "category": "Peluquería",
  "available": true
}
```

**Respuesta esperada:** `201 Created`.

El servicio recibe un identificador generado automáticamente.

### Consultar servicios

**Solicitud:**

`GET http://localhost:3000/api/services`

Devuelve una lista de los servicios registrados.

### Consultar un servicio por ID

**Solicitud:**

`GET http://localhost:3000/api/services/ID_DEL_SERVICIO`

Reemplaza `ID_DEL_SERVICIO` por el identificador real del servicio.

### Actualizar un servicio

**Solicitud:**

`PUT http://localhost:3000/api/services/ID_DEL_SERVICIO`

La solicitud debe incluir todos los campos del servicio:

```json
{
  "name": "Corte de cabello actualizado",
  "description": "Corte tradicional actualizado",
  "duration": 35,
  "price": 9000,
  "category": "Peluquería",
  "available": true
}
```

### Eliminar un servicio

**Solicitud:**

`DELETE http://localhost:3000/api/services/ID_DEL_SERVICIO`

Elimina el servicio correspondiente al identificador indicado.

## 7. Endpoints de reservas

La ruta base es:

`/api/bookings`

| Método HTTP | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva. |
| GET | `/api/bookings/:bid` | Consulta una reserva por su ID. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

### Crear una reserva

**Solicitud:**

`POST http://localhost:3000/api/bookings`

En Postman, selecciona `Body → raw → JSON` e introduce:

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-11-15",
  "time": "10:30",
  "status": "pending"
}
```

**Respuesta esperada:** `201 Created`.

La reserva recibe un ID generado automáticamente y comienza con una lista de servicios vacía.

### Consultar una reserva

**Solicitud:**

`GET http://localhost:3000/api/bookings/ID_DE_LA_RESERVA`

Reemplaza `ID_DE_LA_RESERVA` por el identificador real de la reserva.

### Agregar un servicio a una reserva

**Solicitud:**

`POST http://localhost:3000/api/bookings/ID_DE_LA_RESERVA/services/ID_DEL_SERVICIO`

Reemplaza ambos identificadores por los valores reales. Esta operación no requiere un cuerpo JSON.

El servicio debe existir y estar disponible. Si ya está asociado a la reserva, se incrementa su cantidad.

## 8. Validaciones y manejo de errores

La API valida los datos antes de guardar la información.

### Validaciones de servicios

- El nombre, la descripción y la categoría deben ser textos no vacíos.
- La duración debe ser un número entero mayor que cero.
- El precio debe ser un número mayor o igual a cero.
- La disponibilidad debe ser un valor booleano.
- No se permite enviar un ID manual al crear o actualizar un servicio.
- En las actualizaciones se requieren todos los campos definidos del servicio.

### Validaciones de reservas

- El nombre del cliente no puede estar vacío.
- El correo electrónico debe tener un formato válido.
- La fecha debe ser una fecha de calendario válida en formato `YYYY-MM-DD`.
- La hora debe tener formato `HH:mm`.
- Si se proporciona el estado, no puede ser un texto vacío.
- Los servicios y las reservas deben existir para poder asociarlos.

### Códigos HTTP utilizados

- `200 OK`: solicitud procesada correctamente.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: datos de entrada inválidos.
- `404 Not Found`: recurso no encontrado.
- `409 Conflict`: servicio no disponible para la operación.
- `500 Internal Server Error`: error interno del servidor.

Los errores de validación incluyen un estado de error, un mensaje descriptivo y, cuando corresponde, una lista de errores específicos.

## 9. Persistencia de datos

Los datos se almacenan localmente en archivos JSON:

- `src/data/services.json`
- `src/data/bookings.json`

Los cambios se escriben en estos archivos, por lo que los datos pueden conservarse después de reiniciar el servidor.

Este mecanismo de persistencia está pensado para un proyecto de aprendizaje y no sustituye una base de datos para un entorno de producción.

## 10. Pruebas con Postman

Para probar la API:

1. Inicia el servidor con `npm run dev`.
2. Abre Postman.
3. Utiliza la dirección base `http://localhost:3000`.
4. Selecciona el método HTTP correspondiente.
5. Para las solicitudes POST y PUT, configura `Body → raw → JSON` cuando corresponda.
6. Comprueba el código de estado y el contenido de la respuesta.
7. Revisa los archivos JSON para verificar la persistencia de los datos.

Se recomienda probar las operaciones de consulta, creación, actualización, eliminación, validación de datos y asociación de servicios a reservas.

## 11. Autor

Proyecto académico: Sistema de Reservas API.

Desarrollado con Node.js y Express.
