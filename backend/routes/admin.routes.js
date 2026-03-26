
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { requireAuth } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/admin.middleware");

const excelController = require("../controllers/excel.controller");
const { exportUsers } = require("../controllers/export.controller");

// 🔴 NUEVO (SOLO ESTA LÍNEA AGREGADA)
const { enviarNotificacionAdmin } = require("../controllers/notificaciones.controller");

const { eliminarNotificacionesHoy } = require("../controllers/notificaciones.controller");


// 🔹 ASEGURAR QUE EXISTAN LAS CARPETAS
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir("uploads/ofertas");
ensureDir("uploads/beneficios");
ensureDir("uploads/excel");


// 🔹 CONFIGURAR MULTER
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    if (file.fieldname === "banner") {
      cb(null, "uploads/ofertas");
    }

    else if (file.fieldname === "beneficio") {
      cb(null, "uploads/beneficios");
    }

    else if (file.fieldname === "excel") {
      cb(null, "uploads/excel");
    }

    else {
      cb(new Error("Tipo de archivo no permitido"));
    }

  },

  filename: function (req, file, cb) {

    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;

    cb(null, name);

  }

});

const upload = multer({ storage });


// 🔹 TEST ADMIN
router.get("/panel", requireAuth, requireAdmin, (req, res) => {

  res.json({
    message: "Bienvenido ADMIN",
    user: req.user
  });

});


// 🔹 SUBIR EXCEL DE PUNTOS
router.post(
  "/upload-excel",
  requireAuth,
  requireAdmin,
  upload.single("excel"),
  excelController.uploadExcel
);


// 🔹 SUBIR BANNER OFERTA
router.post(
  "/upload-banner",
  requireAuth,
  requireAdmin,
  upload.single("banner"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "No se subió ningún archivo"
      });
    }

    res.json({
      message: "Banner subido correctamente",
      file: req.file.filename
    });

  }
);


// 🔹 SUBIR BANNER BENEFICIO
router.post(
  "/upload-beneficio",
  requireAuth,
  requireAdmin,
  upload.single("beneficio"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "No se subió ningún archivo"
      });
    }

    res.json({
      message: "Beneficio subido correctamente",
      file: req.file.filename
    });

  }
);


// 🔹 LISTAR BANNERS OFERTAS
router.get(
  "/banners",
  requireAuth,
  requireAdmin,
  (req, res) => {

    const folder = path.join(__dirname, "..", "uploads", "ofertas");

    const files = fs
      .readdirSync(folder)
      .sort((a, b) => b.localeCompare(a));

    const banners = files.map(file => ({
      name: file,
      url: `/uploads/ofertas/${file}`
    }));

    res.json(banners);

  }
);


// 🔹 LISTAR BENEFICIOS
router.get(
  "/beneficios",
  requireAuth,
  requireAdmin,
  (req, res) => {

    const folder = path.join(__dirname, "..", "uploads", "beneficios");

    const files = fs
      .readdirSync(folder)
      .sort((a, b) => b.localeCompare(a));

    const beneficios = files.map(file => ({
      name: file,
      url: `/uploads/beneficios/${file}`
    }));

    res.json(beneficios);

  }
);


// 🔹 ELIMINAR BANNER
router.delete(
  "/delete-banner/:name",
  requireAuth,
  requireAdmin,
  (req, res) => {

    try {

      const fileName = req.params.name;

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "ofertas",
        fileName
      );

      if (!fs.existsSync(filePath)) {

        return res.status(404).json({
          message: "Banner no encontrado"
        });

      }

      fs.unlinkSync(filePath);

      res.json({
        message: "Banner eliminado correctamente"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Error eliminando banner"
      });

    }

  }
);


// 🔹 ELIMINAR BENEFICIO
router.delete(
  "/delete-beneficio/:name",
  requireAuth,
  requireAdmin,
  (req, res) => {

    try {

      const fileName = req.params.name;

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "beneficios",
        fileName
      );

      if (!fs.existsSync(filePath)) {

        return res.status(404).json({
          message: "Beneficio no encontrado"
        });

      }

      fs.unlinkSync(filePath);

      res.json({
        message: "Beneficio eliminado correctamente"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Error eliminando beneficio"
      });

    }

  }
);


// 🔴 NUEVO: ENVIAR NOTIFICACIÓN A TODOS
router.post(
  "/notificacion",
  requireAuth,
  requireAdmin,
  enviarNotificacionAdmin
);

router.delete(
  "/notificaciones-hoy",
  requireAuth,
  requireAdmin,
  eliminarNotificacionesHoy
);

// 🔴 NUEVO: para exportar ususrios en el excel
router.get("/export-users", requireAuth, requireAdmin, exportUsers);
module.exports = router;