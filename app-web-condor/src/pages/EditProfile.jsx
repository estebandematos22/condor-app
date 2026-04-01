// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import "./EditProfile.css";

export default function EditarPerfil({ onBack }) {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    localidad: "",
    domicilio: "",
    fecha_nacimiento: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOk, setShowOk] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsuario() {
      try {
        setError("");

        if (!token) {
          setError("No hay token. Volvé a iniciar sesión.");
          return;
        }

        const res = await fetch("http://localhost:4000/api/usuario/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error cargando perfil");
        }

        setFormData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
          telefono: data.telefono || "",
          localidad: data.localidad || "",
          domicilio: data.domicilio || "",
          fecha_nacimiento: data.fecha_nacimiento
            ? String(data.fecha_nacimiento).slice(0, 10)
            : "",
        });
      } catch (err) {
        console.log("Error cargando perfil:", err);
        setError(err.message || "Error cargando perfil");
      }
    }

    fetchUsuario();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      if (!token) {
        throw new Error("No hay token. Volvé a iniciar sesión.");
      }

      const payload = { ...formData };

      const res = await fetch("http://localhost:4000/api/usuario/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error actualizando");
      }

      setShowOk(true);

      setTimeout(() => {
        setShowOk(false);
        if (onBack) onBack();
      }, 1200);
    } catch (err) {
      console.error("Error actualizando:", err);
      setError(err.message || "Error actualizando");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 SOLO ESTO SE MODIFICÓ (eliminar cuenta)
  const handleEliminarCuenta = async () => {
    if (!window.confirm("¿Seguro querés eliminar tu cuenta? Esta acción es irreversible")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/usuario/eliminar", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error eliminando cuenta");
      }

      // 🔴 LIMPIAR SESIÓN
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔴 REDIRIGIR AL INICIO (LOGIN / REGISTER)
      window.location.href = "/";

    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      alert("Error eliminando cuenta");
    }
  };

  return (
    <div className="editar-perfil-container">

      {/* 🔴 HEADER AGREGADO */}
      <header className="home4-header">
        <div className="user-section">
          <img src="/logoapp.png" alt="logo" className="header-logo" />
          <h2 className="user-name">Editar Perfil</h2>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-volver" onClick={() => onBack && onBack()}>
            Volver
          </button>

          <button
            onClick={handleEliminarCuenta}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Eliminar cuenta
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            name="apellido"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            name="telefono"
            type="text"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Localidad</label>
          <input
            name="localidad"
            type="text"
            value={formData.localidad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Domicilio</label>
          <input
            name="domicilio"
            type="text"
            value={formData.domicilio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn-guardar" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>

      {showOk && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="check">✓</div>
            <h3>Datos actualizados</h3>
            <p>Se guardaron correctamente ✅</p>
          </div>
        </div>
      )}
    </div>
  );
}