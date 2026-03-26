const db = require("../config/db");

// 🔹 OBTENER NOTIFICACIONES (SOLO DEL DÍA)
exports.getNotificaciones = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM notificaciones 
       WHERE user_id = ? 
       AND DATE(fecha) = CURDATE()
       ORDER BY fecha DESC`,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};


// 🔴 ENVIAR NOTIFICACIÓN A TODOS (ADMIN)
exports.enviarNotificacionAdmin = async (req, res) => {

  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ message: "Mensaje requerido" });
  }

  try {

    const [usuarios] = await db.query("SELECT id FROM users");

    for (let user of usuarios) {
      await db.query(
        "INSERT INTO notificaciones (user_id, mensaje, leida, fecha) VALUES (?, ?, 0, NOW())",
        [user.id, mensaje]
      );
    }

    res.json({ message: "Notificación enviada a todos" });

  } catch (error) {

    console.error("Error enviando notificación:", error);
    res.status(500).json({ message: "Error enviando notificación" });

  }

};


// 🔴 MARCAR TODAS COMO LEÍDAS
exports.marcarComoLeidas = async (req, res) => {
  try {

    const { userId } = req.params;

    await db.query(
      "UPDATE notificaciones SET leida = 1 WHERE user_id = ?",
      [userId]
    );

    res.json({ message: "Notificaciones marcadas como leídas" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};


// 🔴 ELIMINAR TODAS LAS NOTIFICACIONES (OPCIONAL)
exports.eliminarTodas = async (req, res) => {
  try {

    const { userId } = req.params;

    await db.query(
      "DELETE FROM notificaciones WHERE user_id = ?",
      [userId]
    );

    res.json({ message: "Notificaciones eliminadas" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};


// 🆕 🔴 ELIMINAR NOTIFICACIONES DEL DÍA (ADMIN)
exports.eliminarNotificacionesHoy = async (req, res) => {
  try {

    await db.query(
      "DELETE FROM notificaciones WHERE DATE(fecha) = CURDATE()"
    );

    res.json({ message: "Notificaciones de hoy eliminadas" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando notificaciones" });
  }
};