const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

if (process.env.DATABASE_URL) {
  console.log("👉 Usando DATABASE_URL");

  db = mysql.createPool(process.env.DATABASE_URL);

} else {
  console.log("👉 Usando variables locales");

  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
}

// 🔥 PRUEBA DE CONEXIÓN DETALLADA
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("🟢 CONEXIÓN EXITOSA A MYSQL 🚀");
    conn.release();
  } catch (err) {
    console.error("🔴 ERROR REAL MYSQL:");
    console.error(err); // 👈 ESTO ES LO IMPORTANTE
  }
})();

module.exports = db;