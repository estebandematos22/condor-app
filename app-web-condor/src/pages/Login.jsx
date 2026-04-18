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

  // 🔥 LOGIN DEMO (SIN BACKEND)
  if (dni === "123" && password === "123") {
  const fakeUser = {
    id: 1,
    nombre: "José",
    apellido: "Cliente",
    role: "user" // 🔥 IMPORTANTE (NO admin)
  };

  localStorage.setItem("token", "demo-token");
  localStorage.setItem("user", JSON.stringify(fakeUser));

  if (typeof onLoginSuccess === "function") {
    onLoginSuccess();
  }

  return;
}

  // 🔥 LOGIN REAL (tu backend)
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

    {/* FONDO */}
    <img src="/fondocarrito.png" className="login-bg" />

    {/* OVERLAY OSCURO */}
    <div className="login-overlay"></div>

    {/* CONTENIDO */}
    <div className="login-content">

      <h1>Bienvenido/a!</h1>

      <div className="input-group">
        <span>👤</span>
        <input
          type="text"
          placeholder="Usuario"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
      </div>

      <div className="input-group">
        <span>🔒</span>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn-login" onClick={handleLogin} disabled={loading}>
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>

      <p className="register-text">
        ¿No tienes una cuenta?{" "}
        <span onClick={onBack}>REGISTRATE</span>
      </p>

    </div>
  </div>
);
}

export default Login;
