import mysql from 'mysql2/promise';

declare global {
  var pool: mysql.Pool | undefined;
}

const pool = global.pool || mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'drivestudio',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

if (process.env.NODE_ENV !== 'production') {
  global.pool = pool;
}

export default pool;
