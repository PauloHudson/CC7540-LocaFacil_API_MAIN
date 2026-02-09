const pool = require('../config/database');

class UserModel {
  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(data) {
    const { name, email, password, phone, cpf, is_admin } = data;
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, cpf, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, is_admin, created_at',
      [name, email, password, phone, cpf, is_admin || false]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(data[key]);
      paramCount++;
    });

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT id, name, email, phone, cpf, is_admin, is_active, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  static async delete(id) {
    const result = await pool.query('UPDATE users SET is_active = FALSE WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = UserModel;
