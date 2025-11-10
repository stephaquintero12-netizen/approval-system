const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    
    const [requests] = await pool.execute(`
      SELECT r.*, 
        ur.full_name as requester_name,
        ua.full_name as approver_name
      FROM requests r
      LEFT JOIN users ur ON r.requester_id = ur.id
      LEFT JOIN users ua ON r.approver_id = ua.id
      ORDER BY r.created_at DESC
    `);
    res.json(requests);
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener las solicitudes',
      details: error.message 
    });
  }
});

router.post('/', async (req, res) => {
  let connection;
  try {
    const { title, description, request_type, priority, requester_id, approver_id } = req.body;

    if (!title || !description || !request_type || !requester_id || !approver_id) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios' 
      });
    }

    connection = await pool.getConnection();
    const requestId = `REQ-${Date.now().toString().slice(-6)}`;
    const createdAt = new Date();
    const [result] = await connection.execute(
      `INSERT INTO requests 
       (request_id, title, description, request_type, priority, requester_id, approver_id, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [requestId, title, description, request_type, priority || 'medium', requester_id, approver_id, createdAt]
    );

    const [requests] = await connection.execute(`
      SELECT r.*, 
        ur.full_name as requester_name,
        ua.full_name as approver_name
      FROM requests r
      LEFT JOIN users ur ON r.requester_id = ur.id
      LEFT JOIN users ua ON r.approver_id = ua.id
      WHERE r.id = ?
    `, [result.insertId]);
    
    const newRequest = requests[0];
    try {
      const { sendNewRequestNotification } = require('../services/emailService');
      const [approvers] = await connection.execute(
        'SELECT * FROM users WHERE id = ?', 
        [approver_id]
      );
      
      const approver = approvers[0];
      
      if (approver && approver.email) {
        
        sendNewRequestNotification(newRequest, approver)
          .then(() => console.log('✅ Email enviado exitosamente'))
          .catch(emailError => console.error('❌ Error enviando email:', emailError.message));
      } else {
        const stephanieApprover = { email: 'nicolstephanieb.q@gmail.com', full_name: 'Stephanie Baez' };
        sendNewRequestNotification(newRequest, stephanieApprover)
          .then(() => console.log('✅ Email enviado a Stephanie'))
          .catch(emailError => console.error('❌ Error enviando email a Stephanie:', emailError.message));
      }
    } catch (emailError) {
    }
    await connection.execute(
      'INSERT INTO request_history (request_id, user_id, action, comment) VALUES (?, ?, "created", ?)',
      [result.insertId, requester_id, 'Solicitud creada automáticamente']
    );

    connection.release();

    res.status(201).json({ 
      success: true,
      message: 'Solicitud creada exitosamente',
      data: newRequest
    });

  } catch (error) {
    if (connection) connection.release();
    res.status(500).json({ 
      success: false,
      error: 'Error al crear la solicitud: ' + error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [requests] = await pool.execute(`
      SELECT r.*, 
        ur.full_name as requester_name,
        ua.full_name as approver_name
      FROM requests r
      LEFT JOIN users ur ON r.requester_id = ur.id
      LEFT JOIN users ua ON r.approver_id = ua.id
      WHERE r.id = ?
    `, [req.params.id]);
    
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    res.json(requests[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la solicitud' });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const [history] = await pool.execute(`
      SELECT rh.*, u.full_name, u.username
      FROM request_history rh
      LEFT JOIN users u ON rh.user_id = u.id
      WHERE rh.request_id = ?
      ORDER BY rh.created_at DESC
    `, [req.params.id]);
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

router.put('/:id/approve', async (req, res) => {
  let connection;
  try {
    const { user_id, comment } = req.body;
    
    connection = await pool.getConnection();
    
    await connection.execute(
      'UPDATE requests SET status = "approved", updated_at = ? WHERE id = ?',
      [new Date(), req.params.id]
    );
    
    await connection.execute(
      'INSERT INTO request_history (request_id, user_id, action, comment) VALUES (?, ?, "approved", ?)',
      [req.params.id, user_id, comment || 'Solicitud aprobada']
    );
    
    connection.release();
    
    res.json({ 
      success: true,
      message: 'Solicitud aprobada exitosamente' 
    });
  } catch (error) {
    if (connection) connection.release();
    res.status(500).json({ error: 'Error al aprobar la solicitud' });
  }
});

router.put('/:id/reject', async (req, res) => {
  let connection;
  try {
    const { user_id, comment } = req.body;
    
    connection = await pool.getConnection();
    
    await connection.execute(
      'UPDATE requests SET status = "rejected", updated_at = ? WHERE id = ?',
      [new Date(), req.params.id]
    );
    
    await connection.execute(
      'INSERT INTO request_history (request_id, user_id, action, comment) VALUES (?, ?, "rejected", ?)',
      [req.params.id, user_id, comment || 'Solicitud rechazada']
    );
    
    connection.release();
    
    res.json({ 
      success: true,
      message: 'Solicitud rechazada exitosamente' 
    });
  } catch (error) {
    if (connection) connection.release();
    res.status(500).json({ error: 'Error al rechazar la solicitud' });
  }
});

module.exports = router;