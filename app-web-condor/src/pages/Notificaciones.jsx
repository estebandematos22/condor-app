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
        <img src="/logo1.png" alt="logo" className="noti-logo" />
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

      {/* CONTENIDO */}
<main className="noti-content">

  {/* 🎉 CUMPLEAÑOS */}
  <div className="notif-demo cumple">

    <div className="notif-header-demo">
      🎉 FELIZ CUMPLEAÑOS
    </div>

    <div className="notif-body">
      <h3>¡Feliz cumpleaños José! 🎂</h3>

      <p>
        Te saluda Supermercado El Cóndor ❤️
        Esperamos que tengas un hermoso día.
      </p>

      <small>hoy • 08:00 hs</small>
    </div>

  </div>

  {/* 🛒 PROMOCIONES */}

  
  <div className="notif-demo promo">

    <div className="notif-header-demo">
      🔥 PROMOCIONES DEL DÍA
    </div>

    <div className="notif-body">
      <h3>¡Hoy es sábado! 🛒</h3>

      <p>
        Disfrutá de nuestras promociones
        exclusivas y beneficios especiales.
      </p>

      <small>hoy • 09:30 hs</small>
    </div>

  </div>

  {/* 💳 TARJETA */}
  <div className="notif-demo tarjeta">

    <div className="notif-header-demo">
      💳 BENEFICIOS CON TARJETA
    </div>

    <div className="notif-body">
      <h3>¡Pagando con tu tarjeta ahorrás más!</h3>

      <p>
        Aprovechá descuentos especiales
        disponibles esta semana.
      </p>

      <small>hoy • 11:15 hs</small>
    </div>

  </div>

</main>
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