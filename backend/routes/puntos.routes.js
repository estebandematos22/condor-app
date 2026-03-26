const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const db = require("../config/db");

router.get("/me", requireAuth, async (req, res) => {

  try {

    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT puntos_actuales FROM puntos WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {

      return res.json({
        puntos: 0
      });

    }

    res.json({
      puntos: rows[0].puntos_actuales
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error obteniendo puntos"
    });

  }

});

module.exports = router;