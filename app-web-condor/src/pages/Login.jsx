import { useState } from "react";
import "./Login.css";

function Login({ onBack, onLoginSuccess }) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!dni || !password) {
      setError("Completá DNI y contraseña");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dni: dni.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }

    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
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
