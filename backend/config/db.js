const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔥 DEBUG REAL
(async () => {
  try {
    console.log("📡 HOST:", process.env.MYSQLHOST);
    console.log("👤 USER:", process.env.MYSQLUSER);
    console.log("🔑 PASS:", process.env.MYSQLPASSWORD ? "OK" : "NO LLEGA");
    console.log("🗄 DB:", process.env.MYSQLDATABASE);

    const conn = await db.getConnection();
    console.log("🟢 CONEXIÓN EXITOSA A MYSQL 🚀");
    conn.release();
  } catch (err) {
    console.error("🔴 ERROR REAL MYSQL:");
    console.error(err);
  }
})();

module.exports = db;