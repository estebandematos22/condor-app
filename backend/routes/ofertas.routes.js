const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {

  try {

    const folder = path.join(__dirname, "..", "uploads", "ofertas");

    if (!fs.existsSync(folder)) {
      return res.json([]);
    }

    const files = fs.readdirSync(folder);

    const banners = files.map(file => ({
      url: `/uploads/ofertas/${file}`
    }));

    res.json(banners);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error obteniendo ofertas"
    });

  }

});

module.exports = router;