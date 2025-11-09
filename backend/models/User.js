const { pool } = require('../config/database');

class User {

  static async getAllUsers() {
    const [rows] = await pool.execute(`
      SELECT id, username, email, full_name, role, is_active, created_at
      FROM users 
      WHERE is_active = TRUE
      ORDER BY full_name
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT id, username, email, full_name, role, is_active, created_at
      FROM users 
      WHERE id = ? AND is_active = TRUE
    `, [id]);
    return rows[0];
  }

  static async findByRole(role) {
    const [rows] = await pool.execute(`
      SELECT id, username, email, full_name, role, is_active, created_at
      FROM users 
      WHERE role = ? AND is_active = TRUE
      ORDER BY full_name
    `, [role]);
    return rows;
  }
}

module.exports = User;