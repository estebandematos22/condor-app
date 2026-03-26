const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// 🔴 ACTUALIZADO (agregamos limpieza también)
const { 
  limpiarNotificaciones,
  ejecutarCumpleanios,
  notificacionLunes,
  notificacionFinde
} = require("./jobs/notificaciones.job");

// Rutas
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const puntosRoutes = require("./routes/puntos.routes");
const ofertasRoutes = require("./routes/ofertas.routes"); 
const beneficiosRoutes = require("./routes/beneficios.routes");
const notificacionesRoutes = require("./routes/notificaciones.routes");

const app = express();

// 🔐 CORS preparado para producción futura
const allowedOrigins = [
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("❌ No permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 🔧 Middleware JSON
app.use(express.json());

// 📂 Servir archivos subidos
app.use("/uploads", express.static("uploads"));

// 🌐 Ruta test
app.get("/", (req, res) => {
  res.send("Backend Supermercado El Cóndor funcionando ✅");
});

// 🔐 AUTH
app.use("/api/auth", authRoutes);

// 👤 USUARIO
app.use("/api/usuario", userRoutes);

// ⭐ PUNTOS
app.use("/api/puntos", puntosRoutes);

// ⭐ OFERTAS
app.use("/api/ofertas", ofertasRoutes);

// ⭐ BENEFICIOS
app.use("/api/beneficios", beneficiosRoutes);

// 👑 ADMIN
app.use("/api/admin", adminRoutes);

// 🔔 NOTIFICACIONES
app.use("/api/notificaciones", notificacionesRoutes);

const PORT = process.env.PORT || 4000;

// 🚀 Levantar servidor SOLO si conecta la DB
(async () => {
  try {

    const connection = await db.getConnection();

    console.log("🟢 Conectado a MySQL correctamente");

    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);

      // 🔥 EJECUTA TODO AUTOMÁTICO
      setInterval(() => {
        limpiarNotificaciones();   // 🧹 NUEVO
        ejecutarCumpleanios();
        notificacionLunes();
        notificacionFinde();
      }, 60000);

    });

  } catch (error) {

    console.error("🔴 Error de conexión MySQL:", error.message);

  }
})();