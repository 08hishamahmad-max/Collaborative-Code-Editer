"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Default Vite port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Database Connection Pool
const pool = new pg_1.Pool({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'collabcode',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.get('/health/db', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    }
    catch (err) {
        console.error('Database health check failed:', err);
        res.status(503).json({ status: 'error', message: 'Database unavailable' });
    }
});
app.use('/api/auth', (0, auth_1.createAuthRouter)({ pool }));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
