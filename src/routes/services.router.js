const express = require('express');
const ServiceManager = require('../managers/ServiceManager');

const router = express.Router();
const serviceManager = new ServiceManager();

// Valida todos los campos del servicio.
function validateService(data) {
  const errors = [];

  if (typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name debe ser un texto no vacío');
  }

  if (
    typeof data.description !== 'string' ||
    !data.description.trim()
  ) {
    errors.push('description debe ser un texto no vacío');
  }

  if (
    !Number.isInteger(data.duration) ||
    data.duration <= 0
  ) {
    errors.push('duration debe ser un número entero mayor que 0');
  }

  if (
    typeof data.price !== 'number' ||
    !Number.isFinite(data.price) ||
    data.price < 0
  ) {
    errors.push('price debe ser un número mayor o igual a 0');
  }

  if (
    typeof data.category !== 'string' ||
    !data.category.trim()
  ) {
    errors.push('category debe ser un texto no vacío');
  }

  if (typeof data.available !== 'boolean') {
    errors.push('available debe ser true o false');
  }

  return errors;
}

// GET /api/services
router.get('/', (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: serviceManager.getServices()
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/:sid
router.get('/:sid', (req, res, next) => {
  try {
    const service = serviceManager.getServiceById(req.params.sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    res.json({
      status: 'success',
      data: service
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/services
router.post('/', (req, res, next) => {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'El cuerpo debe ser un objeto JSON'
      });
    }

    if (Object.hasOwn(req.body, 'id')) {
      return res.status(400).json({
        status: 'error',
        message: 'El id se genera automáticamente y no debe enviarse'
      });
    }

    const errors = validateService(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Datos del servicio inválidos',
        errors
      });
    }

    const service = serviceManager.addService({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      duration: req.body.duration,
      price: req.body.price,
      category: req.body.category.trim(),
      available: req.body.available
    });

    res.status(201).json({
      status: 'success',
      message: 'Servicio creado correctamente',
      data: service
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/:sid
router.put('/:sid', (req, res, next) => {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'El cuerpo debe ser un objeto JSON'
      });
    }

    if (Object.hasOwn(req.body, 'id')) {
      return res.status(400).json({
        status: 'error',
        message: 'No se permite modificar el id'
      });
    }

    const allowedFields = [
      'name',
      'description',
      'duration',
      'price',
      'category',
      'available'
    ];

    const unknownFields = Object.keys(req.body).filter(
      field => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Hay campos no permitidos',
        fields: unknownFields
      });
    }

    const errors = validateService(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos del servicio son obligatorios',
        errors
      });
    }

    const updatedService = serviceManager.updateService(
      req.params.sid,
      {
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        duration: req.body.duration,
        price: req.body.price,
        category: req.body.category.trim(),
        available: req.body.available
      }
    );

    if (!updatedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Servicio actualizado correctamente',
      data: updatedService
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/services/:sid
router.delete('/:sid', (req, res, next) => {
  try {
    const deletedService = serviceManager.deleteService(req.params.sid);

    if (!deletedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Servicio eliminado correctamente',
      data: deletedService
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;