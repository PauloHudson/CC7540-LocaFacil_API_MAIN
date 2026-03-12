const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  let client;
  try {
    console.log('Starting migrations...');
    
    // Testar conexão
    client = await pool.connect();
    console.log('✓ Database connected successfully');
    client.release();
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${files.length} migration files`);
    
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`\nRunning migration: ${file}`);
      try {
        await pool.query(sql);
        console.log(`✓ Migration completed: ${file}`);
      } catch (migrationError) {
        console.error(`✗ Error in migration ${file}:`, migrationError.message);
        throw migrationError;
      }
    }
    
    console.log('\n✓ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

