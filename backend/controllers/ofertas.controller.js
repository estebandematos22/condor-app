const db = require("../config/db");

exports.uploadOferta = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No se subió imagen" });
    }

    const imagePath = `/uploads/ofertas/${req.file.filename}`;

    await db.execute(
      "INSERT INTO ofertas (imagen) VALUES (?)",
      [imagePath]
    );

    res.json({
      message: "Oferta subida correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error subiendo oferta"
    });
  }
};