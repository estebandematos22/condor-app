const express = require("express");
const router = express.Router();

// 🔥 Import correcto
const { requireAuth } = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

const { eliminarCuenta } = require("../controllers/user.controller");



// Obtener perfil del usuario logueado
router.get("/me", requireAuth, userController.getMe);

// Actualizar perfil del usuario logueado
router.put("/me", requireAuth, userController.updateMe);

// 🔴 CORREGIDO ACÁ (ANTES authMiddleware ❌)
router.delete("/eliminar", requireAuth, eliminarCuenta);






module.exports = router;