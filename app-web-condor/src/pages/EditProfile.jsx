return (
  <div className="editar-perfil-container">

    <header className="home4-header">
      <div className="user-section">
        <img src="/logo1.png" alt="logo" className="header-logo" />
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

    {/* 🔥 SOLO ESTO SE AGREGA */}
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

        <button className="btn-guardar" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
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