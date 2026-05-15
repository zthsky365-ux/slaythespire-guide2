const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5Mv9ATlzSxQP@ep-calm-scene-aqizdx4s.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

async function test() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Users:', JSON.stringify(result.rows, null, 2));
    
    // Test login query
    const loginResult = await pool.query("SELECT * FROM users WHERE email = 'zthsky365@gmail.com'");
    console.log('\nLogin test:', loginResult.rows.length > 0 ? 'User found' : 'User not found');
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

test();
