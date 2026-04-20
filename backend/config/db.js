const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'fapd_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection and log status
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully.');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('⚠️  Please ensure your MySQL server is running and database "fapd_db" is created.');
    }
}

checkConnection();

module.exports = pool;
