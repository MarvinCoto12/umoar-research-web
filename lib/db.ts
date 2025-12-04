import mysql from 'mysql2/promise';

// Variable global para guardar la conexión en desarrollo
const globalForDb = globalThis as unknown as {
  conn: mysql.Pool | undefined;
};

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'umoar_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// guardamos la conexión en la variable global
if (process.env.NODE_ENV !== 'production') globalForDb.conn = pool;