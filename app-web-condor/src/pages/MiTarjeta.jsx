import "./MiTarjeta.css";
import { useEffect, useState } from "react";

function MiTarjeta({ onBack }) {
  const [userName, setUserName] = useState("");
  const [flip, setFlip] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/usuario/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(userData);

      if (!res.ok) {
        throw new Error(data.message || "Error cargando usuario");
      }

      setUserData(data);

      const fullName =
        (data.nombre || "") + " " + (data.apellido || "");

      setUserName(fullName.toUpperCase());

    } catch (error) {
      console.error("Error cargando usuario:", error);

      // fallback por si falla el backend
      const storedUser = localStorage.getItem("user");
      try {
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const fullName =
            (parsed.nombre || "") + " " + (parsed.apellido || "");
          setUserName(fullName.toUpperCase());
          setUserData(parsed);
        }
      } catch {
        console.error("Error leyendo usuario");
      }
    }
  };

  cargarUsuario();
}, []);

  return (
    <div className="mt-page">

      {/* HEADER */}
      <div className="mt-header">
        <span className="mt-username"> {userName}</span>
        <button className="mt-back-btn" onClick={onBack}>
        Volver</button>
        <div className="mt-bell">🔔</div>
      </div>

      {/* TITULO */}
      <div className="mt-title-row">
        <span className="mt-icon">💳</span>
        <span className="mt-title">Mi tarjeta</span>
      </div>

      {/* TARJETA */}
<div className="card-wrapper">
  <div className={`flip-card ${flip ? "flipped" : ""}`} onClick={() => setFlip(!flip)}>
    <div className="flip-inner">

      {/* ===== FRENTE (TU CODIGO EXACTO) ===== */}
      <div className="flip-front">
        <div className="condor-card">

          <div className="card-top-text">
            <h3>COMUNIDAD SUPER EL CONDOR</h3>
            <span>TARJETA DE BENEFICIOS</span>
          </div>

          <img src="/chip.gif" alt="chip" className="card-chip" />

          <img
            src="/mapamisiones.png"
            alt="Provincia de Misiones"
            className="card-map"
          />

          <div className="card-map-dot"></div>
          

          <div className="card-name">{userName}</div>

          <div className="barcode"></div>

          
          <span className="card-dni">DNI: {userData?.dni || "-"}</span>

        </div>
      </div>

      {/* ===== ATRÁS (MINIMo) ===== */}
      <div className="flip-back">
  <div className="condor-card">

    <div className="card-back-content">

      {/* IZQUIERDA */}
      <div className="card-left">

        {/* CLIENTE */}
        <div className="back-block">
          <span className="back-label">N.º DE CLIENTE</span>
          <span className="back-value big">30104</span>
        </div>

        {/* PUNTOS */}
        <div className="back-block">
          <span className="back-label">PUNTOS ACUMULADOS</span>
          <span className="back-value">
          {userData?.puntos_actuales || 0}
            </span>
        </div>

      </div>

      {/* DERECHA */}
      <div className="card-right">

        {/* TITULAR */}
        <div className="back-block">
          <span className="back-label">TITULAR</span>
          <span className="back-value small">{userName}</span>
        </div>

        {/* FECHA */}
        <div className="back-block">
          <span className="back-label">FECHA DE EMISIÓN</span>
          <span className="back-value small">06/06/26</span>
        </div>

      </div>

    </div>

  </div>
</div>

    </div>
  </div>
</div>

      {/* FOOTER */}
      <footer className="home4-footer">

  <a
    href="https://superelcondor.com.ar/"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <div className="footer-item">
      <img src="/iconominorista.png" alt="minorista" />
      <span>Minorista</span>
    </div>
  </a>

  <a
    href="https://mayoristaelcondor.com.ar/"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <div className="footer-item">
      <img src="/icono-mayorista.png" alt="mayorista" />
      <span>Mayorista</span>
    </div>
  </a>

  <div className="footer-item">
    <img src="/icono-pregunta.png" alt="preguntas" />
    <span>Preguntas</span>
  </div>

  <div className="footer-item">
    <img src="/icono-candado.png" alt="privacidad" />
    <span>Privacidad</span>
  </div>

</footer>
    </div>
  );
}

export default MiTarjeta;