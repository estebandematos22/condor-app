const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Middleware de autenticación
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();


// ==========================
// RUTA TEST
// ==========================
router.get("/test", (req, res) => {
  res.json({
    ok: true,
    message: "Auth routes funcionando correctamente"
  });
});


// ==========================
// REGISTRO
// ==========================
router.post("/register", async (req, res) => {
  try {

    const {
      nombre,
      apellido,
      telefono,
      domicilio,
      localidad,
      dni,
      fecha_nacimiento,
      password
    } = req.body;

    if (!dni || !password) {
      return res.status(400).json({
        ok: false,
        message: "DNI y contraseña son obligatorios"
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (nombre, apellido, telefono, domicilio, localidad, dni, fecha_nacimiento, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      nombre || null,
      apellido || null,
      telefono || null,
      domicilio || null,
      localidad || null,
      dni,
      fecha_nacimiento || null,
      hashedPassword
    ]);

    res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente"
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        ok: false,
        message: "El DNI ya está registrado"
      });
    }

    res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
});


// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {

  try {

    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({
        ok: false,
        message: "DNI y contraseña son obligatorios"
      });
    }

    // Buscar usuario (incluye role)
    const [rows] = await db.execute(
      "SELECT id, nombre, apellido, dni, password_hash, role FROM users WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas"
      });
    }

    const user = rows[0];

    // Comparar contraseña
    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas"
      });
    }

    // Crear token JWT (incluye role)
    const token = jwt.sign(
      {
        id: user.id,
        dni: user.dni,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h"
      }
    );

    res.json({
      ok: true,
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        dni: user.dni,
        role: user.role
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
});


// ==========================
// PERFIL DEL USUARIO (ME)
// ==========================
router.get("/me", requireAuth, async (req, res) => {

  try {

    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT id, nombre, apellido, dni, role FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado"
      });
    }

    res.json({
      ok: true,
      user: rows[0]
    });

  } catch (error) {

    console.error("ME ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
});


module.exports = router;