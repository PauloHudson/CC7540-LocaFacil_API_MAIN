const pool = require('../config/database');

const normalizeImageUrls = (imageUrls) => {
  if (!imageUrls) {
    return null;
  }

  if (Array.isArray(imageUrls)) {
    const normalized = imageUrls.map((url) => String(url).trim()).filter(Boolean);
    return normalized.length ? normalized : null;
  }

  const normalized = String(imageUrls)
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);

  return normalized.length ? normalized : null;
};

class ElectronicModel {
  static async findById(id) {
    const result = await pool.query('SELECT * FROM electronics WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getAll(status = null) {
    let query = 'SELECT * FROM electronics';
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
      'SELECT * FROM electronics WHERE status = $1 ORDER BY created_at DESC',
      ['available']
    );
    return result.rows;
  }

  static async create(data) {
    const { name, brand, model, specifications, daily_price, image_urls } = data;
    console.log('[MODEL Electronic.create] Input image_urls:', image_urls);
    const normalizedImageUrls = normalizeImageUrls(image_urls);
    console.log('[MODEL Electronic.create] Normalized image_urls:', normalizedImageUrls);
    const result = await pool.query(
      'INSERT INTO electronics (name, brand, model, specifications, daily_price, image_urls) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, brand, model, specifications, daily_price, normalizedImageUrls]
    );
    console.log('[MODEL Electronic.create] Result from DB image_urls:', result.rows[0].image_urls);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      const value = key === 'image_urls' ? normalizeImageUrls(data[key]) : data[key];
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    });

    values.push(id);
    const query = `UPDATE electronics SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE electronics SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM electronics WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = ElectronicModel;
