import { useState } from "react";
import "./Register.css";

function Register({ onSuccess, onBack }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    domicilio: "",
    localidad: "",
    dni: "",
    fecha_nacimiento: "",
    password: "",
    confirm: "",
    terms: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔐 Reglas contraseña
  const hasMinLength = form.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasNumber = /\d/.test(form.password);
  const passwordOk = hasMinLength && hasUppercase && hasNumber;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.terms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    if (!passwordOk) {
      setError("La contraseña no cumple los requisitos");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          domicilio: form.domicilio,
          localidad: form.localidad,
          dni: form.dni,
          fecha_nacimiento: form.fecha_nacimiento,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al registrar");
        setLoading(false);
        return;
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);

    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      
      <img src="/logo.png" alt="Logo" className="register-logo" />

      <h2 className="register-title">CREAR CUENTA</h2>

      <div className="register-card">

        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
          <input name="dni" placeholder="DNI" onChange={handleChange} required />

          <div className="row-two">
            <input name="fecha_nacimiento" type="date" onChange={handleChange} required />
            <input name="localidad" placeholder="Localidad" onChange={handleChange} required />
          </div>

          <input name="domicilio" placeholder="Domicilio" onChange={handleChange} required />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          {/* 🔴 VISUAL MEJORADO */}
          <div className="password-rules">
            <p className={hasMinLength ? "ok" : "bad"}>• 8 caracteres mínimo</p>
            <p className={hasUppercase ? "ok" : "bad"}>• Una mayúscula</p>
            <p className={hasNumber ? "ok" : "bad"}>• Un número</p>
          </div>

          <input
            type="password"
            name="confirm"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
            required
          />

          <label className="terms-check">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            He leído y acepto los términos y condiciones
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Continuar"}
          </button>
        </form>

        <button className="btn-secondary-full" onClick={onBack}>
          Volver
        </button>
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="check">✓</div>
            <h3>Registro exitoso</h3>
            <p>Cuenta creada correctamente</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;