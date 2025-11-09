const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

router.get('/', async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes: ' + error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, request_type, priority, requester_id, approver_id } = req.body;
    
    if (!title || !description || !request_type || !requester_id || !approver_id) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        received: req.body 
      });
    }

    const requestId = await Request.create({
      title,
      description,
      request_type,
      priority: priority || 'medium',
      requester_id,
      approver_id
    });

    res.status(201).json({ 
      message: 'Solicitud creada exitosamente',
      id: requestId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la solicitud: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la solicitud' });
  }
});

module.exports = router;