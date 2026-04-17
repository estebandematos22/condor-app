import "./Ubicacion.css";

function Ubicacion({ onBack }) {

  const abrirMapa = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="ubi-container">

      {/* HEADER */}
      <header className="ubi-header">
        <img src="/logo1.png" alt="logo" className="ubi-logo" />
        <h2 className="ubi-title">Ubicaciones</h2>

        <button className="ubi-back" onClick={onBack}>
          Volver
        </button>
      </header>

      {/* CONTENIDO */}
      <main className="ubi-content">

        <button
          className="ubi-btn"
          onClick={() =>
            abrirMapa("https://maps.app.goo.gl/vq6tzPwCaKkNVeJM7?g_st=iwb")
          }
        >
          🏬 Casa Central
        </button>

        <button
          className="ubi-btn"
          onClick={() =>
            abrirMapa("https://maps.app.goo.gl/vHCaU9xNJaNWeJmE7?g_st=iwb")
          }
        >
          🏬 Beltrame
        </button>

        <button className="ubi-btn disabled">
          🏬 Tucumán (próximamente)
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

export default Ubicacion;