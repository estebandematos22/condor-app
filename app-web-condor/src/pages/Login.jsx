import { useState } from "react";
import "./Login.css";

function Login({ onBack, onLoginSuccess }) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
  if (!dni || !password) {
    setError("Completá DNI y contraseña");
    return;
  }

  setError("");
  setLoading(true);

  // 🔥 LOGIN DEMO
  setTimeout(() => {
    const demoUser = {
      nombre: "Jose",
      apellido: "Fritz"
    };

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(demoUser));

    if (typeof onLoginSuccess === "function") {
      onLoginSuccess();
    }

    setLoading(false);
  }, 800);
};

  return (
    <div className="login-container">

      {/* LOGO */}
      <img
        src="/logo.png"
        alt="Logo El Cóndor"
        className="login-logo"
      />

      {/* CARD */}
      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <button className="btn-secondary-full" onClick={onBack}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default Login;
