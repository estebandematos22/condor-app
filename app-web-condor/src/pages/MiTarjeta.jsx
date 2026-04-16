import "./MiTarjeta.css";
import { useEffect, useState } from "react";

function MiTarjeta({ onBack }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const fullName =
          (parsed.nombre || "") + " " + (parsed.apellido || "");
        setUserName(fullName.toUpperCase());
      }
    } catch {
      console.error("Error leyendo usuario");
    }
  }, []);

  return (
    <div className="mt-page">

      {/* HEADER */}
      <div className="mt-header">
        <span className="mt-username">Hola {userName}</span>
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
        <div className="condor-card">

          <div className="card-top-text">
            <h3>COMUNIDAD SUPER EL CONDOR</h3>
            <span>TARJETA DE BENEFICIOS</span>
          </div>

          {/* CHIP */}
          <img
            src="/chip.gif"
            alt="chip"
            className="card-chip"
          />

          {/* MAPA */}
          <img
            src="/mapamisiones.png"
            alt="Provincia de Misiones"
            className="card-map"
          />

          <div className="card-map-dot"></div>

          <div className="card-name">{userName}</div>

          <div className="barcode"></div>

          <span className="card-client">CLIENTE:30104</span> 
         
          <span className="card-dni">DNI: 28803999</span>

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
            🛒
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
            📦
            <span>Mayorista</span>
          </div>
        </a>

        <div className="footer-item red">
          ❓
          <span>Preguntas</span>
        </div>

        <div className="footer-item">
          🔒
          <span>Privacidad</span>
        </div>

      </footer>

    </div>
  );
}

export default MiTarjeta;