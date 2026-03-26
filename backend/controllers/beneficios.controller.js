const db = require("../config/db");

exports.uploadBeneficio = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No se subió imagen"
      });
    }

    const imagePath = `/uploads/beneficios/${req.file.filename}`;

    await db.execute(
      "INSERT INTO beneficios (imagen) VALUES (?)",
      [imagePath]
    );

    res.json({
      message: "Beneficio subido correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error subiendo beneficio"
    });

  }

};