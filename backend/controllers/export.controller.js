const ExcelJS = require("exceljs");
const db = require("../config/db");

// 🆕 EXPORTAR USUARIOS A EXCEL REAL
const exportUsers = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT nombre, apellido, dni, domicilio, localidad
      FROM users
      ORDER BY id DESC
    `);

    if (!rows.length) {
      return res.status(404).json({ message: "No hay usuarios" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    // 🔥 COLUMNAS
    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "DNI", key: "dni", width: 15 },
      { header: "Domicilio", key: "domicilio", width: 30 },
      { header: "Localidad", key: "localidad", width: 20 },
    ];

    // 🔥 DATOS
    rows.forEach((user) => {
      worksheet.addRow(user);
    });

    // 🔥 HEADER EN NEGRITA
    worksheet.getRow(1).font = { bold: true };

    // 🔥 RESPUESTA EXCEL REAL
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=clientes.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error exportando usuarios:", error);
    res.status(500).json({ message: "Error exportando usuarios" });
  }
};

module.exports = { exportUsers };