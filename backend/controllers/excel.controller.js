const XLSX = require("xlsx");
const path = require("path");
const db = require("../config/db");

exports.uploadExcel = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No se subió ningún archivo"
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "excel",
      req.file.filename
    );

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const data = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    let actualizados = 0;

    for (const row of data) {

      const dni = String(row.dni || row.DNI || "").trim();
      const puntos = Number(row.puntos || row.PUNTOS || 0);
      const beneficio = String(row.beneficio || row.BENEFICIO || "").trim();

      if (!dni) continue;

      // 🔎 buscar usuario por DNI
      const [users] = await db.execute(
        "SELECT id FROM users WHERE dni = ?",
        [dni]
      );

      if (users.length === 0) continue;

      const userId = users[0].id;

      // 🔎 verificar si ya tiene registro en puntos
      const [registro] = await db.execute(
        "SELECT id FROM puntos WHERE user_id = ?",
        [userId]
      );

      if (registro.length > 0) {

        // actualizar puntos
        await db.execute(
          "UPDATE puntos SET puntos_actuales = ? WHERE user_id = ?",
          [puntos, userId]
        );

      } else {

        // crear registro de puntos
        await db.execute(
          "INSERT INTO puntos (user_id, puntos_actuales) VALUES (?, ?)",
          [userId, puntos]
        );

      }

      // ⭐ guardar beneficio
      await db.execute(
        "UPDATE users SET beneficio = ? WHERE id = ?",
        [beneficio, userId]
      );

      // 🔴 NUEVO: NOTIFICACIÓN DE PUNTOS (SIN DUPLICAR EN EL DÍA)
      const [existeNoti] = await db.execute(
        `SELECT id FROM notificaciones 
         WHERE user_id = ? 
         AND mensaje LIKE '%puntos fueron actualizados%' 
         AND DATE(fecha) = CURDATE()`,
        [userId]
      );

      if (existeNoti.length === 0) {

        await db.execute(
          "INSERT INTO notificaciones (user_id, mensaje, leida, fecha) VALUES (?, ?, 0, NOW())",
          [
            userId,
            "⭐ Tus puntos fueron actualizados"
          ]
        );

      }

      actualizados++;

    }

    res.json({
      message: "Excel procesado correctamente",
      clientes_actualizados: actualizados
    });

  } catch (error) {

    console.error("ERROR EXCEL:", error);

    res.status(500).json({
      message: "Error procesando el Excel"
    });

  }

};