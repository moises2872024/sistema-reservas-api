const express = require('express');

const servicesRouter = require('./routes/services.router');
const bookingsRouter = require('./routes/bookings.router');

const app = express();

// Permite recibir y procesar cuerpos JSON.
app.use(express.json());

// Ruta principal.
app.get('/', (req, res) => {
  res.json({
    message: 'API de servicios y reservas funcionando',
    endpoints: {
      services: '/api/services',
      bookings: '/api/bookings'
    }
  });
});

// Rutas principales de la API.
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

// Ruta para endpoints inexistentes.
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores generales.
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.status ? err.message : 'Error interno del servidor'
  });
});

module.exports = app;