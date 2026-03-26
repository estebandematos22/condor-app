const db = require("../config/db");
const bcrypt = require("bcryptjs");

// REGISTRO
exports.register = async (req, res) => {
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

    // Validación básica
    if (!dni || !password || !nombre || !apellido) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Verificar si ya existe el DNI
    const [exists] = await db.query(
      "SELECT id FROM users WHERE dni = ?",
      [dni]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "El DNI ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar usuario (IMPORTANTE: password_hash)
    const [result] = await db.query(
      `INSERT INTO users 
      (nombre, apellido, telefono, domicilio, localidad, dni, fecha_nacimiento, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        telefono,
        domicilio,
        localidad,
        dni,
        fecha_nacimiento,
        hashedPassword
      ]
    );

    // 🔥 Crear registro en tabla puntos automáticamente
    await db.query(
      "INSERT INTO puntos (user_id, puntos_actuales) VALUES (?, 0)",
      [result.insertId]
    );

    res.status(201).json({ message: "Registro exitoso" });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};