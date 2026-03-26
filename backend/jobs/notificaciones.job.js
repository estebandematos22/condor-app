const db = require("../config/db");

// 🧹 LIMPIAR NOTIFICACIONES VIEJAS (NUEVO)
const limpiarNotificaciones = async () => {
  try {

    await db.query(
      "DELETE FROM notificaciones WHERE DATE(fecha) < CURDATE()"
    );

    console.log("🧹 Notificaciones antiguas eliminadas");

  } catch (error) {
    console.error("Error limpiando notificaciones:", error);
  }
};


// 🎂 CUMPLEAÑOS
const ejecutarCumpleanios = async () => {

  try {

    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth() + 1;

    const [usuarios] = await db.query(`
      SELECT id, nombre 
      FROM users 
      WHERE DAY(fecha_nacimiento) = ? 
      AND MONTH(fecha_nacimiento) = ?
    `, [dia, mes]);

    for (let user of usuarios) {

      const [existe] = await db.query(
        `SELECT id FROM notificaciones 
         WHERE user_id = ? 
         AND mensaje LIKE '%Feliz cumpleaños%' 
         AND DATE(fecha) = CURDATE()`,
        [user.id]
      );

      if (existe.length > 0) continue;

      // 🎯 👉 ACA CAMBIÁS EL MENSAJE
      const mensaje = `🎂 ¡Feliz cumpleaños ${user.nombre}, te desea El SUPERMERCADO EL CONDOR! 🎉`;

      await db.query(
        "INSERT INTO notificaciones (user_id, mensaje, leida, fecha) VALUES (?, ?, 0, NOW())",
        [user.id, mensaje]
      );

    }

    console.log("🎂 Cumpleaños OK");

  } catch (error) {
    console.error("Error cumpleaños:", error);
  }

};


// 💪 BUEN COMIENZO DE SEMANA (LUNES)
const notificacionLunes = async () => {

  try {

    const hoy = new Date();

    if (hoy.getDay() !== 1) return;

    const [usuarios] = await db.query("SELECT id FROM users");

    for (let user of usuarios) {

      const [existe] = await db.query(
        `SELECT id FROM notificaciones 
         WHERE user_id = ? 
         AND mensaje LIKE '%Buen comienzo de semana%' 
         AND DATE(fecha) = CURDATE()`,
        [user.id]
      );

      if (existe.length > 0) continue;

      const mensaje = "💪 ¡Buen comienzo de semana! Aprovechá nuestras ofertas 🛒";

      await db.query(
        "INSERT INTO notificaciones (user_id, mensaje, leida, fecha) VALUES (?, ?, 0, NOW())",
        [user.id, mensaje]
      );

    }

    console.log("💪 Lunes enviado");

  } catch (error) {
    console.error("Error lunes:", error);
  }

};


// 🥳 BUEN FINDE (VIERNES)
const notificacionFinde = async () => {

  try {

    const hoy = new Date();

    if (hoy.getDay() !== 5) return;

    const [usuarios] = await db.query("SELECT id FROM users");

    for (let user of usuarios) {

      const [existe] = await db.query(
        `SELECT id FROM notificaciones 
         WHERE user_id = ? 
         AND mensaje LIKE '%Buen finde%' 
         AND DATE(fecha) = CURDATE()`,
        [user.id]
      );

      if (existe.length > 0) continue;

      const mensaje = "🥳 ¡Buen finde! No te pierdas nuestras promociones 🎉";

      await db.query(
        "INSERT INTO notificaciones (user_id, mensaje, leida, fecha) VALUES (?, ?, 0, NOW())",
        [user.id, mensaje]
      );

    }

    console.log("🥳 Finde enviado");

  } catch (error) {
    console.error("Error finde:", error);
  }

};


module.exports = {
  limpiarNotificaciones, // 🔥 NUEVO
  ejecutarCumpleanios,
  notificacionLunes,
  notificacionFinde
};