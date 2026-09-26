import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fitfoot_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok')
    return rows.length > 0
  } catch (error) {
    console.error('Database connection failed:', error.message)
    return false
  }
}

export default pool
