import mysql from 'mysql2/promise';

async function migrate() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'drivestudio'
  });

  try {
    console.log("Starting migration...");
    await connection.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT");
    console.log("Added avatar_url to users");
    console.log("Migration finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
