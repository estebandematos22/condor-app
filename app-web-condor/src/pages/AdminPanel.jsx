import { useEffect, useState } from "react";
import "./AdminPanel.css";

function AdminPanel({ onBack }) {

  const token = localStorage.getItem("token");

  const [banners, setBanners] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [mensajeNoti, setMensajeNoti] = useState("");

  const cargarBanners = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/banners",
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      );
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error cargando banners",error);
    }
  };

  const cargarBeneficios = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/beneficios",
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      );
      const data = await res.json();
      setBeneficios(data);
    } catch (error) {
      console.error("Error cargando beneficios",error);
    }
  };

  useEffect(()=>{
    cargarBanners();
    cargarBeneficios();
  },[]);

  const subirExcel = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("excel",file);

    try{
      const res = await fetch(
        "http://localhost:4000/api/admin/upload-excel",
        {
          method:"POST",
          headers:{ Authorization:`Bearer ${token}` },
          body:formData
        }
      );
      const data = await res.json();
      alert(data.message);
    }catch(error){
      console.error("Error subiendo excel",error);
    }

    e.target.value = "";
  };

  const subirBanner = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("banner",file);

    try{
      const res = await fetch(
        "http://localhost:4000/api/admin/upload-banner",
        {
          method:"POST",
          headers:{ Authorization:`Bearer ${token}` },
          body:formData
        }
      );
      const data = await res.json();
      alert(data.message);
      cargarBanners();
    }catch(error){
      console.error("Error subiendo banner",error);
    }

    e.target.value = "";
  };

  const subirBeneficio = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("beneficio",file);

    try{
      const res = await fetch(
        "http://localhost:4000/api/admin/upload-beneficio",
        {
          method:"POST",
          headers:{ Authorization:`Bearer ${token}` },
          body:formData
        }
      );
      const data = await res.json();
      alert(data.message);
      cargarBeneficios();
    }catch(error){
      console.error("Error subiendo beneficio",error);
    }

    e.target.value = "";
  };

  const eliminarBanner = async(name)=>{
    if(!window.confirm("¿Eliminar banner?")) return;

    try{
      const res = await fetch(
        `http://localhost:4000/api/admin/delete-banner/${name}`,
        {
          method:"DELETE",
          headers:{ Authorization:`Bearer ${token}` }
        }
      );
      const data = await res.json();
      alert(data.message);
      cargarBanners();
    }catch(error){
      console.error("Error eliminando banner",error);
    }
  };

  const eliminarBeneficio = async(name)=>{
    if(!window.confirm("¿Eliminar beneficio?")) return;

    try{
      const res = await fetch(
        `http://localhost:4000/api/admin/delete-beneficio/${name}`,
        {
          method:"DELETE",
          headers:{ Authorization:`Bearer ${token}` }
        }
      );
      const data = await res.json();
      alert(data.message);
      cargarBeneficios();
    }catch(error){
      console.error("Error eliminando beneficio",error);
    }
  };

  const enviarNotificacion = async () => {
    if (!mensajeNoti.trim()) {
      alert("Escribí un mensaje");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/notificacion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ mensaje: mensajeNoti })
        }
      );

      const data = await res.json();
      alert(data.message || "Notificación enviada");
      setMensajeNoti("");

    } catch (error) {
      console.error("Error enviando notificación", error);
    }
  };

  // 🆕 ELIMINAR NOTIFICACIONES DEL DÍA
  const eliminarNotificacionesHoy = async () => {

    if (!window.confirm("¿Eliminar notificaciones de hoy?")) return;

    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/notificaciones-hoy",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      alert(data.message);

    } catch (error) {
      console.error(error);
    }
  };

  // 🆕 DESCARGAR USUARIOS EXCEL
const descargarUsuarios = async () => {
  try {
    const res = await fetch(
      "http://localhost:4000/api/admin/export-users",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      throw new Error("Error al descargar");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "clientes.xlsx"; // 🔥 ahora sí es Excel real
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error descargando usuarios", error);
    alert("Error al descargar usuarios");
  }
};

  return (

    <div className="admin-container">

      <header className="admin-header">
        <h2>Panel Administrador</h2>
      </header>

      <div className="admin-actions">

        <label className="admin-btn">
          📊 Subir Excel de Puntos
          <input type="file" accept=".xlsx,.xls" hidden onChange={subirExcel}/>
        </label>

        <label className="admin-btn">
          🖼 Subir Banner Ofertas
          <input type="file" accept="image/*" hidden onChange={subirBanner}/>
        </label>

        <label className="admin-btn">
          🎁 Subir Banner Beneficios
          <input type="file" accept="image/*" hidden onChange={subirBeneficio}/>
        </label>

        <button className="admin-btn" onClick={descargarUsuarios}>
  📥 Descargar Clientes
</button>

      </div>

      <div className="admin-banners">
        <h3>Ofertas</h3>
        {banners.length === 0 ? <p>No hay banners</p> :
          banners.map((b)=>(
            <div key={b.name} className="admin-banner-item">
              <img src={`http://localhost:4000${b.url}`} alt="banner"/>
              <button className="admin-delete" onClick={()=>eliminarBanner(b.name)}>Eliminar</button>
            </div>
          ))
        }

        <h3>Beneficios</h3>
        {beneficios.length === 0 ? <p>No hay beneficios</p> :
          beneficios.map((b)=>(
            <div key={b.name} className="admin-banner-item">
              <img src={`http://localhost:4000${b.url}`} alt="beneficio"/>
              <button className="admin-delete" onClick={()=>eliminarBeneficio(b.name)}>Eliminar</button>
            </div>
          ))
        }
      </div>

      <div className="admin-notificaciones">
        <h3>📢 Enviar Notificación</h3>

        <textarea
          placeholder="Escribí el mensaje..."
          value={mensajeNoti}
          onChange={(e) => setMensajeNoti(e.target.value)}
          className="admin-textarea"
        />

        <button className="admin-btn" onClick={enviarNotificacion}>
          Enviar a todos
        </button>

        {/* 🆕 BOTÓN NUEVO */}
        <button className="admin-btn red" onClick={eliminarNotificacionesHoy}>
          🗑 Eliminar notificaciones de hoy
        </button>

      </div>

      <button className="admin-back" onClick={onBack}>
        Volver
      </button>

    </div>
  );
}

export default AdminPanel;