import { useEffect, useState } from "react";
import "./Ofertas.css";

function Ofertas({ onBack }) {

  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {

    const fetchOfertas = async () => {

      try {

        const res = await fetch("http://localhost:4000/api/ofertas");

        const data = await res.json();

        setOfertas(data);

        // 🔴 NUEVO: marcar ofertas como vistas
        localStorage.setItem("ofertas_vistas", JSON.stringify(data));

      } catch (error) {

        console.error("Error cargando ofertas", error);

      }

    };

    fetchOfertas();

  }, []);

  return (
    <div className="of-page">

      {/* HEADER */}
      <header className="of-header">
        <div className="of-header-left">
          <img src="/logo1.png" alt="logo" className="of-logo" />
          <h2 className="of-title">Ofertas</h2>
        </div>

        <button className="of-back" onClick={onBack}>
          Volver
        </button>
      </header>

    



      {/* CONTENIDO */}
      <main className="of-content">

        {ofertas.length === 0 ? (

          <div className="of-placeholder">
            No hay ofertas disponibles
          </div>

        ) : (
          
              
          ofertas.map((oferta) => (

            <div key={oferta.id || oferta.url} className="of-banner-container">

              <img
                src={`http://localhost:4000${oferta.url}`}
                alt="oferta"
                className="of-banner"
              />

            </div>

          ))

        )}
       

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

export default Ofertas;