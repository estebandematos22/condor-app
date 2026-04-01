import "./Ubicacion.css";

function Ubicacion({ onBack }) {

  const abrirMapa = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="ubi-container">

      {/* HEADER */}
      <header className="ubi-header">
        <img src="/logoapp.png" alt="logo" className="ubi-logo" />
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
        <div className="footer-item">🛒 <span>Minorista</span></div>
        <div className="footer-item">📦 <span>Mayorista</span></div>
        <div className="footer-item red">❓ <span>Preguntas</span></div>
        <div className="footer-item">🔒 <span>Privacidad</span></div>
      </footer>

    </div>
  );
}

export default Ubicacion;