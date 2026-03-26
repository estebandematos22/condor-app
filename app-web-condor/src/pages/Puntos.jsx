import { useEffect, useState } from "react";
import "./Puntos.css";

function Puntos({ onBack }) {

  const [puntos, setPuntos] = useState(0);

  useEffect(() => {

    const fetchPuntos = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:4000/api/puntos/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setPuntos(data.puntos);

          // 🔴 NUEVO: marcar como visto
          localStorage.setItem("puntos_vistos", data.puntos);
        }

      } catch (error) {
        console.error("Error obteniendo puntos:", error);
      }

    };

    fetchPuntos();

  }, []);

  return (
    <div className="puntos-container">

      {/* HEADER */}
      <header className="puntos-header">
        <img src="/logo.png" alt="logo" className="puntos-logo" />
        <h2 className="puntos-title">Puntos</h2>
      </header>

      {/* CONTENIDO */}
      <main className="puntos-content">

        <div className="puntos-card">
          <h3>Tus puntos acumulados</h3>
          <div className="puntos-number">{puntos}</div>
          <p>Seguí comprando y sumá más beneficios</p>
        </div>

        <button className="puntos-back-btn" onClick={onBack}>
          Volver al inicio
        </button>

      </main>

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

export default Puntos;