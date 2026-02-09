const pool = require('../config/database');

class RentalModel {
  static async create(data) {
    const {
      user_id,
      vehicle_id,
      electronic_id,
      rental_type,
      start_date,
      end_date,
      total_days,
      daily_rate,
      total_price,
      insurance_selected,
      insurance_price,
      final_total
    } = data;

    const result = await pool.query(
      `INSERT INTO rentals (
        user_id, vehicle_id, electronic_id, rental_type, start_date, 
        end_date, total_days, daily_rate, total_price, insurance_selected, 
        insurance_price, final_total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        user_id, vehicle_id, electronic_id, rental_type, start_date,
        end_date, total_days, daily_rate, total_price, insurance_selected,
        insurance_price || 0, final_total
      ]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM rentals WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByUserId(user_id) {
    const result = await pool.query(
      `SELECT r.*, 
              v.name as vehicle_name, v.brand, v.model,
              e.name as electronic_name, e.brand as electronic_brand
       FROM rentals r
       LEFT JOIN vehicles v ON r.vehicle_id = v.id
       LEFT JOIN electronics e ON r.electronic_id = e.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [user_id]
    );
    return result.rows;
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT r.*, 
              u.name as user_name, u.email,
              v.name as vehicle_name, v.brand, v.model,
              e.name as electronic_name, e.brand as electronic_brand
       FROM rentals r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN vehicles v ON r.vehicle_id = v.id
       LEFT JOIN electronics e ON r.electronic_id = e.id
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE rentals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async updatePaymentStatus(id, payment_status) {
    const result = await pool.query(
      'UPDATE rentals SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [payment_status, id]
    );
    return result.rows[0];
  }

  static async checkAvailability(item_id, item_type, start_date, end_date) {
    let query;
    if (item_type === 'vehicle') {
      query = `
        SELECT COUNT(*) as count FROM rentals 
        WHERE vehicle_id = $1 
        AND status = 'active'
        AND daterange(start_date, end_date, '[]') && daterange($2::date, $3::date, '[]')
      `;
    } else {
      query = `
        SELECT COUNT(*) as count FROM rentals 
        WHERE electronic_id = $1 
        AND status = 'active'
        AND daterange(start_date, end_date, '[]') && daterange($2::date, $3::date, '[]')
      `;
    }

    const result = await pool.query(query, [item_id, start_date, end_date]);
    return Number(result.rows[0].count) === 0;
  }
}

module.exports = RentalModel;
