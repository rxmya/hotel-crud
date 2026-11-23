import fs from 'node:fs';
import { pool } from '../src/db.js';
const schema = fs.readFileSync('db/schema.sql', 'utf8');
const seed = fs.readFileSync('db/seed.sql', 'utf8');
try {
    await pool.query(schema);
    await pool.query(seed);
    const result = await pool.query('SELECT COUNT(*) FROM hotels');
    console.log(`Database ready: ${result.rows[0].count} hotels inserted.`);
} catch (err) {
    console.error('Database setup failed:', err.message);
} finally {
    await pool.end();
}