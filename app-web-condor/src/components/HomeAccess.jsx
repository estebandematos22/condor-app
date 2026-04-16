import "./HomeAccess.css";

function HomeAccess({ onRegister, onLogin }) {
  return (
    <div className="home-container">

      {/* LOGO */}
      <img
        src="/logo.png"
        alt="Logo El Cóndor"
        className="home-logo"
      />

       {/* TEXTOS DE BENEFICIOS */}
      <div className="home-benefits">
        <p>Sumá puntos en cada compra</p>
        <div className="dot"></div>

        <p>Accedé a descuentos exclusivos</p>
        <div className="dot"></div>

        <p>Usá tu tarjeta digital en caja</p>
      </div>

      {/* BOTONES */}
      <div className="home-buttons">
        <button className="btn-primary" onClick={onRegister}>
          CREAR CUENTA
        </button>

        <button className="btn-secondary" onClick={onLogin}>
          YA TENGO CUENTA
        </button>
      </div>
    </div>
  );
}

export default HomeAccess;
