import { useEffect, useState } from "react";
import "./Notificaciones.css";

function Notificaciones({ onBack }) {

  const [notificaciones, setNotificaciones] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔴 NUEVO: verificar si es admin
  const isAdmin = user?.role === "admin";

  // 🔄 cargar notificaciones
  const cargarNotificaciones = () => {
    if (!user) return;

    fetch(`http://localhost:4000/api/notificaciones/${user.id}`)
      .then(res => res.json())
      .then(data => setNotificaciones(data))
      .catch(err => console.error(err));
  };

 useEffect(() => {
  cargarNotificaciones();

  // 🔴 NUEVO: marcar como leídas automáticamente
  if (user && user.id) {
    fetch(`http://localhost:4000/api/notificaciones/leer/${user.id}`, {
      method: "PUT"
    }).catch(err => console.error(err));
  }

}, []);


  // 🔴 MARCAR COMO LEÍDAS
  const marcarLeidas = async () => {
    try {

      await fetch(`http://localhost:4000/api/notificaciones/leer/${user.id}`, {
        method: "PUT"
      });

      cargarNotificaciones();

    } catch (error) {
      console.error("Error marcando leídas:", error);
    }
  };


  // 🔴 ELIMINAR TODAS
  const eliminarTodas = async () => {

    if (!window.confirm("¿Eliminar todas las notificaciones?")) return;

    try {

      await fetch(`http://localhost:4000/api/notificaciones/eliminar/${user.id}`, {
        method: "DELETE"
      });

      setNotificaciones([]);

    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };


  return (
    <div className="noti-container">

      {/* HEADER */}
      <header className="noti-header">
        <img src="/logoapp.png" alt="logo" className="noti-logo" />
        <h2 className="noti-title">Notificaciones</h2>
       <button className="noti-back-btn header-btn" onClick={onBack}>
  Volver
</button>
      </header>

      {/* 🔴 SOLO ADMIN VE LOS BOTONES */}
      {isAdmin && (
        <div style={{ display: "flex", gap: "10px", padding: "10px 20px" }}>
          
          <button onClick={marcarLeidas} className="noti-action-btn">
            ✔ Marcar leídas
          </button>

          <button onClick={eliminarTodas} className="noti-action-btn red">
            🗑 Eliminar todas
          </button>

        </div>
      )}

      {/* CONTENIDO */}
      <main className="noti-content">

        {notificaciones.length === 0 ? (
          <div className="noti-card">
            No tenés notificaciones todavía
          </div>
        ) : (
          notificaciones.map((n) => (
            <div 
              key={n.id} 
              className={`noti-card ${n.leida ? "leida" : ""}`}
            >
              {n.mensaje}
            </div>
          ))
        )}


      </main>

      

    </div>
  );
}

export default Notificaciones;