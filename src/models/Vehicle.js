const pool = require('../config/database');

class VehicleModel {
  static async findById(id) {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getAll(status = null) {
    let query = 'SELECT * FROM vehicles';
    const values = [];

    if (status) {
      query += ' WHERE status = $1';
      values.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getAvailable() {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE status = $1 ORDER BY created_at DESC',
      ['available']
    );
    return result.rows;
  }

  static async create(data) {
    const { name, brand, model, year, color, license_plate, daily_price } = data;
    const result = await pool.query(
      'INSERT INTO vehicles (name, brand, model, year, color, license_plate, daily_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, brand, model, year, color, license_plate, daily_price]
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
    const query = `UPDATE vehicles SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE vehicles SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = VehicleModel;
