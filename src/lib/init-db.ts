import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

export async function initDb() {
  const dbName = process.env.MYSQL_DATABASE || 'drivestudio';
  let connection;

  try {
    // Try connecting directly with the database selected first (standard for shared hosts like Hostinger)
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: dbName,
    });
    console.log(`Connected directly to database "${dbName}"`);
  } catch (err: any) {
    // If connection with database fails (e.g. database doesn't exist yet), connect without database to create it
    console.log(`Could not connect directly to database "${dbName}" (${err.message}). Attempting connection without database...`);
    try {
      connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await connection.query(`USE \`${dbName}\``);
    } catch (innerErr: any) {
      console.error('Failed to initialize database connection:', innerErr);
      throw innerErr;
    }
  }

  try {

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS drive_files (
        id VARCHAR(36) PRIMARY KEY,
        drive_id VARCHAR(255) NOT NULL,
        token VARCHAR(255),
        download_url TEXT,
        filename VARCHAR(255),
        filesize VARCHAR(50),
        status ENUM('processing', 'ready', 'error') NOT NULL DEFAULT 'processing',
        error_message TEXT,
        user_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS error_logs (
        id VARCHAR(36) PRIMARY KEY,
        drive_id VARCHAR(255),
        message TEXT NOT NULL,
        details JSON,
        user_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        \`key\` VARCHAR(255) PRIMARY KEY,
        \`value\` TEXT NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_providers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        api_key VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safety check: ensure 'status' column exists (in case table was created previously without it)
    try {
      await connection.query("SELECT status FROM api_providers LIMIT 1");
    } catch (err: any) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        console.log('Adding missing "status" column to api_providers...');
        await connection.query("ALTER TABLE api_providers ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER api_key");
      }
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS file_links (
        id VARCHAR(36) PRIMARY KEY,
        file_id VARCHAR(36) NOT NULL,
        provider_id VARCHAR(36) NOT NULL,
        token VARCHAR(255) NOT NULL,
        download_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES drive_files(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES api_providers(id) ON DELETE CASCADE
      )
    `);

    // Insert default API key into api_providers if not exists
    const [existingProviders]: any = await connection.query('SELECT * FROM api_providers');
    if (existingProviders.length === 0) {
      const apiKey = process.env.DRIVECLOUD_TOKEN || '2328a4b69080a0475f1dfac6e00437e9';
      await connection.query('INSERT INTO api_providers (id, name, api_key, status) VALUES (?, ?, ?, ?)', 
        [uuidv4(), 'DriveCloud Primary', apiKey, 'active']);
      console.log('Default API provider initialized.');
    }

    // Insert default admin if not exists
    const [existingAdmin]: any = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@gmail.com']);
    if (existingAdmin.length === 0) {
      await connection.query(`
        INSERT INTO users (id, name, email, password, role) 
        VALUES (?, ?, ?, ?, ?)
      `, [uuidv4(), 'Admin', 'admin@gmail.com', 'admin123', 'admin']);
      console.log('Default admin user created.');
    }

    console.log(`Database "${dbName}" and tables initialized successfully.`);
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}
