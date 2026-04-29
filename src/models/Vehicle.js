const pool = require('../config/database');

const normalizeImageUrls = (imageUrls) => {
  if (!imageUrls) {
    return null;
  }

  console.log('[normalizeImageUrls] Input type:', typeof imageUrls, 'value:', imageUrls);

  // Handle objects (e.g., {"url": ["url"]} or {"url": true})
  if (typeof imageUrls === 'object' && !Array.isArray(imageUrls)) {
    const keys = Object.keys(imageUrls);
    if (keys.length > 0) {
      // If the value is an array, use its first item as the single URL
      if (Array.isArray(imageUrls[keys[0]])) {
        const firstUrl = String(imageUrls[keys[0]][0] || '').trim();
        console.log('[normalizeImageUrls] Extracted first URL from object array:', firstUrl);
        return firstUrl || null;
      }
      // Otherwise, use the first key (it is the URL)
      const firstKey = String(keys[0] || '').trim();
      console.log('[normalizeImageUrls] Extracted first key as URL:', firstKey);
      return firstKey || null;
    }
    return null;
  }

  // Handle arrays
  if (Array.isArray(imageUrls)) {
    const normalized = imageUrls
      .flat()
      .map((url) => String(url).trim())
      .filter(Boolean);
    const firstUrl = normalized[0] || null;
    console.log('[normalizeImageUrls] Normalized array first URL:', firstUrl);
    return firstUrl;
  }

  // Handle strings
  const normalized = String(imageUrls)
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
  console.log('[normalizeImageUrls] Normalized string first URL:', normalized[0] || null);

  return normalized[0] || null;
};

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
    const { name, brand, model, year, color, license_plate, daily_price, image_urls } = data;
    console.log('[MODEL Vehicle.create] Input image_urls:', image_urls);
    const normalizedImageUrls = normalizeImageUrls(image_urls);
    console.log('[MODEL Vehicle.create] Normalized image_urls:', normalizedImageUrls);
    const result = await pool.query(
      'INSERT INTO vehicles (name, brand, model, year, color, license_plate, daily_price, image_urls) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, brand, model, year, color, license_plate, daily_price, normalizedImageUrls]
    );
    console.log('[MODEL Vehicle.create] Result from DB image_urls:', result.rows[0].image_urls);
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
