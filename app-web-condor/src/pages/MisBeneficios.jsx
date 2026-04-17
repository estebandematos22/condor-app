import { useEffect, useState } from "react";
import "./MisBeneficios.css";

function MisBeneficios({ onBack }) {

  const [beneficio, setBeneficio] = useState("");

  useEffect(() => {

    const cargarBeneficio = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:4000/api/usuario/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        console.log("Respuesta backend:", data);

        setBeneficio(data.beneficio || "");

        // 🔴 NUEVO: marcar beneficio como visto
        localStorage.setItem("beneficios_vistos", data.beneficio || "");

      } catch (error) {

        console.error("Error cargando beneficio:", error);

      }

    };

    cargarBeneficio();

  }, []);


  return (
    <div className="ben-page">

      {/* HEADER */}
      <header className="ben-header">

        <div className="ben-header-left">
          <img src="/logo1.png" alt="logo" className="ben-logo" />
          <h2 className="ben-title">Mis Beneficios</h2>
        </div>

        <button className="ben-back" onClick={onBack}>
          Volver
        </button>

      </header>


      {/* CONTENIDO */}
      <main className="ben-content">

        <div className="ben-beneficios-list">

          {beneficio ? (

            <div className="ben-cupon">

              <div className="ben-cupon-title">
                BENEFICIO EXCLUSIVO
              </div>

              <div className="ben-cupon-desc">
                {beneficio}
              </div>

            </div>

          ) : (

            <div className="ben-placeholder">
              No hay beneficios disponibles
            </div>

          )}

        </div>

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

export default MisBeneficios;