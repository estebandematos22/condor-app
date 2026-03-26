const multer = require("multer");
const path = require("path");

// Excel
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/excel");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.uploadExcel = multer({ storage: excelStorage });


// Ofertas
const ofertasStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ofertas");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.uploadOferta = multer({ storage: ofertasStorage });


// Beneficios
const beneficiosStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/beneficios");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.uploadBeneficio = multer({ storage: beneficiosStorage });