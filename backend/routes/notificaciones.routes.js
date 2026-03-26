const express = require("express");
const router = express.Router();

const { getNotificaciones } = require("../controllers/notificaciones.controller");
const { marcarComoLeidas, eliminarTodas } = require("../controllers/notificaciones.controller");

router.get("/:userId", getNotificaciones);
router.put("/leer/:userId", marcarComoLeidas);
router.delete("/eliminar/:userId", eliminarTodas);
module.exports = router;