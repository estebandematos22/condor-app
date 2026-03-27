import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query("SELECT 1 as test");
    res.status(200).json({ ok: true, rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
}