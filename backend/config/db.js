const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

if (process.env.DATABASE_URL) {
  // 🔥 Railway (producción)
  db = mysql.createPool(process.env.DATABASE_URL);
} else {
  // 💻 Local (tu PC)
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

module.exports = db;