const mysql = require("mysql2/promise");

// 🚀 Conexión SOLO para Railway (y fallback local opcional)
const db = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "miapp",
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔥 PRUEBA DE CONEXIÓN
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("🟢 CONECTADO A MYSQL CORRECTAMENTE 🚀");
    conn.release();
  } catch (err) {
    console.error("🔴 ERROR REAL MYSQL:");
    console.error(err);
  }
})();

module.exports = db;