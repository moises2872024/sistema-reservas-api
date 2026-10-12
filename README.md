# Sistema de Reservas API

**Repositorio en GitHub:** https://github.com/moises2872024/sistema-reservas-api

## 1. Descripción del proyecto

Sistema de Reservas API es una API REST desarrollada con Node.js y Express para administrar servicios y reservas.

La aplicación permite crear, consultar, actualizar y eliminar servicios, crear reservas y asociar servicios existentes a una reserva. Los datos se almacenan en archivos JSON mediante el módulo File System (`fs`) de Node.js.

## 2. Tecnologías utilizadas

- Node.js
- Express
- File System (`fs`) para la persistencia de datos
- JSON para almacenar servicios y reservas
- Postman para probar los endpoints HTTP

## 3. Instalación y ejecución

### Requisitos previos

- Tener Node.js y npm instalados.
- Contar con Git para clonar el repositorio.
- Disponer de Postman u otra herramienta para realizar solicitudes HTTP.

### Clonar el repositorio

```bash
git clone https://github.com/moises2872024/sistema-reservas-api.git
cd sistema-reservas-api
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

También se puede iniciar el servidor con:

```bash
npm start
```

Por defecto, el servidor estará disponible en:

`http://localhost:3000`

El puerto se puede configurar mediante la variable de entorno `PORT`. Si no se define, se utiliza el puerto 3000.

## 4. Estructura del proyecto

```text
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

### Responsabilidad de los archivos

- `src/app.js`: configura Express, los middlewares, las rutas y el manejo de errores.
- `src/server.js`: inicia el servidor HTTP.
- `src/config/env.config.js`: define la configuración del puerto.
- `src/managers/ServiceManager.js`: administra los servicios y la lectura y escritura de `services.json`.
- `src/managers/BookingManager.js`: administra las reservas, la asociación de servicios y la persistencia en `bookings.json`.
- `src/routes/services.router.js`: define las rutas HTTP para gestionar servicios y validar los datos recibidos.
- `src/routes/bookings.router.js`: define las rutas HTTP para gestionar reservas y asociar servicios.
- `src/data/services.json`: almacena los servicios.
- `src/data/bookings.json`: almacena las reservas y las referencias a sus servicios.
- `package.json`: contiene las dependencias y los scripts de ejecución.
- `.gitignore`: excluye archivos y carpetas que no deben incluirse en el control de versiones.

## 5. Gestión de servicios

La ruta base es `/api/services`.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/services` | Lista todos los servicios. |
| GET | `/api/services/:id` | Consulta un servicio por su ID. |
| POST | `/api/services` | Crea un servicio con ID automático. |
| PUT | `/api/services/:id` | Actualiza un servicio existente. |
| DELETE | `/api/services/:id` | Elimina un servicio. |

### Ejemplo: crear un servicio

Solicitud:

`POST http://localhost:3000/api/services`

Body en Postman: `raw` → `JSON`.

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

La API genera automáticamente el identificador del servicio y guarda el registro en `src/data/services.json`.

### Validaciones de servicios

- El nombre, la descripción y la categoría deben ser textos no vacíos.
- La duración debe ser un número entero mayor que cero.
- El precio debe ser un número mayor o igual a cero.
- La disponibilidad debe ser un valor booleano.
- El identificador se genera automáticamente al crear el servicio.
- Las actualizaciones deben incluir todos los campos requeridos.

## 6. Gestión de reservas

La ruta base es `/api/bookings`.

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva. |
| GET | `/api/bookings/:bid` | Consulta una reserva por su ID. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio existente a una reserva. |

### Ejemplo: crear una reserva

Solicitud:

`POST http://localhost:3000/api/bookings`

Body en Postman: `raw` → `JSON`.

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-11-15",
  "time": "10:30",
  "status": "pending"
}
```

La API crea la reserva con un identificador automático y una lista de servicios inicialmente vacía.

### Consultar una reserva

Solicitud:

`GET http://localhost:3000/api/bookings/ID_DE_LA_RESERVA`

Se debe reemplazar `ID_DE_LA_RESERVA` por el identificador real.

### Agregar un servicio a una reserva

Solicitud:

`POST http://localhost:3000/api/bookings/ID_DE_LA_RESERVA/services/ID_DEL_SERVICIO`

Se deben reemplazar ambos identificadores por los valores reales. Esta operación no requiere un cuerpo JSON.

El servicio debe existir y estar disponible para poder asociarse a la reserva.

## 7. Relación entre reservas y servicios

La reserva no almacena el objeto completo del servicio. Guarda únicamente su identificador y la cantidad asociada.

Ejemplo de la propiedad `services` de una reserva:

```json
{
  "services": [
    {
      "service": "804f79b1-a0a4-4d7e-a64a-04441fd08532",
      "quantity": 2
    }
  ]
}
```

En este ejemplo, el valor de `service` corresponde al ID de un servicio registrado en `services.json`, mientras que `quantity` indica cuántas veces se ha agregado ese servicio a la reserva.

### Comportamiento de la asociación

- Si el servicio todavía no está en la reserva, se agrega con `quantity: 1`.
- Si el servicio ya está asociado, su cantidad se incrementa en una unidad.
- Si la reserva o el servicio no existen, la operación se rechaza.
- Si el servicio no está disponible, la operación se rechaza.

Esta estructura evita duplicar el objeto completo del servicio dentro de la reserva y permite identificarlo mediante su ID.

## 8. Persistencia con File System

La aplicación utiliza el módulo `fs` de Node.js para leer y escribir archivos JSON.

- `src/data/services.json`: almacena los servicios.
- `src/data/bookings.json`: almacena las reservas y sus servicios asociados.

Los managers se encargan de leer los datos, realizar las modificaciones y escribir los resultados en los archivos correspondientes.

La información permanece almacenada después de detener y volver a iniciar el servidor, siempre que los archivos se conserven.

### Comprobación de persistencia

1. Crear un servicio o una reserva desde Postman.
2. Revisar el archivo JSON correspondiente en VS Code.
3. Detener el servidor.
4. Volver a ejecutar `npm run dev`.
5. Consultar nuevamente el recurso mediante Postman.
6. Verificar que los datos continúen disponibles.

## 9. Validaciones y manejo de errores

La API valida los datos antes de procesarlos.

En los servicios, se comprueban los campos obligatorios, los tipos de datos, la duración, el precio y la disponibilidad.

En las reservas, se validan el nombre del cliente, el formato del correo electrónico, la fecha, la hora y los campos permitidos.

La asociación entre reservas y servicios verifica que ambos recursos existan y que el servicio esté disponible.

### Códigos HTTP

- `200 OK`: solicitud procesada correctamente.
- `201 Created`: recurso creado correctamente.
- `400 Bad Request`: datos inválidos.
- `404 Not Found`: recurso inexistente.
- `409 Conflict`: conflicto relacionado con la disponibilidad del servicio.
- `500 Internal Server Error`: error interno del servidor.

## 10. Pruebas realizadas con Postman

Las rutas se pueden comprobar con Postman utilizando la dirección base `http://localhost:3000`.

Las pruebas recomendadas incluyen:

- Listar servicios y consultar un servicio por ID.
- Crear, actualizar y eliminar servicios.
- Crear una reserva y consultarla por ID.
- Agregar un servicio a una reserva.
- Agregar nuevamente el mismo servicio y comprobar el incremento de `quantity`.
- Intentar enviar datos inválidos.
- Reiniciar el servidor y comprobar la persistencia de los datos.

## 11. Relación con los criterios de evaluación

| Criterio | Implementación |
|---|---|
| Configuración del servidor y estructura (20 %) | Servidor Express, rutas separadas, configuración, scripts y documentación. |
| Gestión de servicios (25 %) | Operaciones CRUD, generación automática de ID y almacenamiento en `services.json`. |
| Gestión de reservas (20 %) | Creación, consulta por ID y asociación de servicios existentes. |
| Persistencia con FileSystem (20 %) | Lectura y escritura de archivos JSON para conservar los datos. |
| Relación reservas-servicios (15 %) | Referencia por ID, cantidad `quantity` e incremento de cantidad al repetir un servicio. |

## 12. Autor y repositorio

**Proyecto:** Sistema de Reservas API

**Repositorio:** https://github.com/moises2872024/sistema-reservas-api

**Tecnologías principales:** Node.js, Express y File System.

Proyecto académico para la gestión de servicios y reservas mediante una API REST.
