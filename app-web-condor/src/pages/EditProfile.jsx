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

  // 🔥 CARGAR DATOS DEL USUARIO DESDE LA BASE
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setError("");

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
        console.error("Error cargando usuario:", err);
        setError("Error cargando datos del usuario");
      }
    };

    if (token) {
      cargarUsuario();
    }
  }, [token]);

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 GUARDAR EN LA BASE DE DATOS
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/usuario/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      const userActual = JSON.parse(localStorage.getItem("user")) || {};

      const actualizado = {
        ...userActual,
        ...formData,
      };

      localStorage.setItem("user", JSON.stringify(actualizado));

      setShowOk(true);

      setTimeout(() => {
        setShowOk(false);
      }, 2000);

    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError("Error al guardar datos");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ELIMINAR CUENTA
  const handleEliminarCuenta = async () => {
  const confirmar = window.confirm("¿Seguro que querés eliminar tu cuenta?");
  if (!confirmar) return;

  try {
    // 🔥 1. ELIMINAR EN BACKEND
    const res = await fetch("http://localhost:4000/api/usuario/eliminar", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar cuenta");
    }

    // 🔥 2. LIMPIAR LOCAL
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    alert("Cuenta eliminada correctamente");

    // 🔥 3. VOLVER AL LOGIN
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Error al eliminar la cuenta");
  }
};
  return (
    <div className="editar-perfil-container">

      <header className="edit-header">

  <div className="edit-left">
    <img src="/logo1.png" alt="logo" className="edit-logo" />
  </div>

  <div className="edit-center">
    <h2 className="edit-title">Perfil</h2>
  </div>

  <div style={{ display: "flex", gap: "10px" }}>
    <button className="btn-volver" onClick={() => onBack && onBack()}>
      Volver
    </button>

    
  </div>

</header>

      <div className="edit-content">

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

          <button className="btn-guardar" type="button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
      onClick={handleEliminarCuenta}
      style={{
  background: "#d32f2f",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "700",
  fontFamily: "Poppins, sans-serif",
  width: "100%",
  marginTop: "10px"
}}
    >
      Eliminar cuenta
    </button>
        </form>

      </div>

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