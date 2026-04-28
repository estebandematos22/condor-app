const db = require("../config/db");

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

  const [rows] = await db.query(
  `SELECT 
      u.id,
      u.nombre,
      u.apellido,
      u.telefono,
      u.dni,
      u.domicilio,
      u.localidad,
      u.fecha_nacimiento,
      u.beneficio,
      p.puntos_actuales
   FROM users u
   LEFT JOIN puntos p ON p.user_id = u.id
   WHERE u.id = ?`,
  [userId]
);
    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);

  } catch (error) {

    console.error("🔥 Error getMe:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });

  }
};

exports.updateMe = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      nombre,
      apellido,
      telefono,
      domicilio,
      localidad,
      fecha_nacimiento
    } = req.body;

    await db.query(
      `UPDATE users
       SET nombre = ?,
           apellido = ?,
           telefono = ?,
           domicilio = ?,
           localidad = ?,
           fecha_nacimiento = ?
       WHERE id = ?`,
      [nombre, apellido, telefono, domicilio, localidad, fecha_nacimiento, userId]
    );

    res.json({
      message: "Perfil actualizado correctamente ✅"
    });

  } catch (error) {

    console.error("🔥 Error updateMe:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });

  }
};
exports.eliminarCuenta = async (req, res) => {
  try {

    const userId = req.user.id; // 🔐 viene del token

    // 🔴 borrar notificaciones
    await db.query(
      "DELETE FROM notificaciones WHERE user_id = ?",
      [userId]
    );

    // 🔴 borrar puntos
    await db.query(
      "DELETE FROM puntos WHERE user_id = ?",
      [userId]
    );

    // 🔴 borrar usuario
    await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    res.json({ message: "Cuenta eliminada correctamente" });

  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    res.status(500).json({ message: "Error eliminando cuenta" });
  }
};