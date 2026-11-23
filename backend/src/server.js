import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.get('/api/health', async (req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.stauts(500).json({ message: 'Something went wrong on the server.'});
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});