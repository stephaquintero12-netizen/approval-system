const { pool } = require('../config/database');

class Request {
  static async findAll() {
    try {
      
      const [rows] = await pool.execute(`
        SELECT 
          r.id,
          r.request_id,
          r.title, 
          r.description,
          r.request_type,
          r.status,
          r.priority,
          r.requester_id,
          r.approver_id,
          r.created_at,
          r.updated_at,
          (SELECT full_name FROM users WHERE id = r.requester_id) as requester_name,
          (SELECT full_name FROM users WHERE id = r.approver_id) as approver_name
        FROM requests r
        ORDER BY r.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(requestData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { title, description, request_type, priority, requester_id, approver_id } = requestData;
      const requestId = `REQ-${Date.now()}`; 
      const [result] = await connection.execute(
        'INSERT INTO requests (request_id, title, description, request_type, priority, requester_id, approver_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [requestId, title, description, request_type, priority || 'medium', requester_id, approver_id]
      );
      
      const newRequestId = result.insertId;
      
      await connection.execute(
        'INSERT INTO request_history (request_id, user_id, action, comment) VALUES (?, ?, ?, ?)',
        [newRequestId, requester_id, 'created', 'Solicitud creada']
      );
      
      await connection.commit();
      return newRequestId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM requests WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Request;