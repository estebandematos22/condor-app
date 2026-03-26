const db = require("../config/db");

exports.getMisPuntos = async (req, res) => {

  try {

    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT puntos_actuales FROM puntos WHERE user_id = ?",
      [userId]
    );

    res.json({
      puntos: rows[0]?.puntos_actuales || 0
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error obteniendo puntos"
    });

  }

};