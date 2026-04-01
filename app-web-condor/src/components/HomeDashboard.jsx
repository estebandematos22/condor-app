import { useEffect, useState } from "react";
import "./HomeDashboard.css";

function HomeDashboard({ 
  onOpenMiTarjeta, 
  onOpenEditarPerfil, 
  onOpenOfertas, 
  onOpenPuntos, 
  onOpenBeneficios,
  onOpenAdmin,
  onOpenNotificaciones,
  onOpenUbicacion, // 🔴 SOLO AGREGADO
}) {

  const [userName] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "";
    try {
      const user = JSON.parse(storedUser);
      return user?.nombre || "";
    } catch {
      return "";
    }
  });

  const [isAdmin] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;

    try {
      const user = JSON.parse(storedUser);
      return user?.role === "admin";
    } catch {
      return false;
    }
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [notiCount, setNotiCount] = useState(0);

  const [puntosNuevos, setPuntosNuevos] = useState(false);
  const [beneficiosNuevos, setBeneficiosNuevos] = useState(false);
  const [ofertasNuevas, setOfertasNuevas] = useState(false);

  const slides = ["/baner2.jpeg", "/baner3.jpeg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    fetch(`http://localhost:4000/api/notificaciones/${user.id}`)
      .then((res) => res.json())
      .then((data) => {

        const vistas = localStorage.getItem("notificaciones_vistas");

        if (vistas === JSON.stringify(data)) {
          setNotiCount(0);
        } else {
          setNotiCount(data.length);
        }

      })
      .catch((err) =>
        console.error("Error obteniendo notificaciones:", err)
      );

  }, []);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/puntos/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        const guardado = localStorage.getItem("puntos_vistos");

        if (guardado === null) {
          localStorage.setItem("puntos_vistos", data.puntos);
        } else if (Number(guardado) !== data.puntos) {
          setPuntosNuevos(true);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchPuntos();
  }, []);

  useEffect(() => {
    const fetchBeneficios = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/usuario/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        const guardado = localStorage.getItem("beneficios_vistos");

        if (guardado === null) {
          localStorage.setItem("beneficios_vistos", data.beneficio || "");
        } else if (guardado !== (data.beneficio || "")) {
          setBeneficiosNuevos(true);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchBeneficios();
  }, []);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ofertas");
        const data = await res.json();

        const guardado = localStorage.getItem("ofertas_vistas");

        if (guardado === null) {
          localStorage.setItem("ofertas_vistas", JSON.stringify(data));
        } else if (guardado !== JSON.stringify(data)) {
          setOfertasNuevas(true);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchOfertas();
  }, []);

  const handleOpenNotificaciones = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    try {
      const res = await fetch(`http://localhost:4000/api/notificaciones/${user.id}`);
      const data = await res.json();

      localStorage.setItem("notificaciones_vistas", JSON.stringify(data));
      setNotiCount(0);

    } catch (error) {
      console.error(error);
    }

    onOpenNotificaciones();
  };

  return (
    <div className="home4-container">

      <header className="home4-header">
        <div className="user-section" onClick={onOpenEditarPerfil}>
          <img src="/logoapp.png" alt="logo" className="header-logo" />
          <h2 className="user-name">hola {userName}!</h2>
        </div>

        <div
          className="bell-btn"
          onClick={handleOpenNotificaciones}
          style={{ cursor: "pointer" }}
        >
          🔔
          {notiCount > 0 && (
            <span className="bell-badge">{notiCount}</span>
          )}
        </div>
      </header>

      <main className="home4-content">

        <div className="carousel shadow">
          <img
            src={slides[currentSlide]}
            alt="oferta"
            className="slide active"
          />
        </div>

        {/* 🔴 NUEVO BOTÓN (NO TOCA NADA MÁS) */}
        <div
          className="ubicacion-btn"
          onClick={onOpenUbicacion}
          style={{ cursor: "pointer" }}
        >
          📍 Encontranos
        </div>

        <div className="quick-access">

          <div className="card shadow" onClick={onOpenMiTarjeta} style={{ cursor: "pointer" }}>
            <span>mi tarjeta</span>
            💳
          </div>

          <div className="card shadow" onClick={onOpenOfertas} style={{ cursor: "pointer", position: "relative" }}>
            {ofertasNuevas && <span className="bell-badge">1</span>}
            <span>ofertas</span>
            💲
          </div>

          <div className="card shadow" onClick={onOpenPuntos} style={{ cursor: "pointer", position: "relative" }}>
            {puntosNuevos && <span className="bell-badge">1</span>}
            <span>puntos</span>
            ⭐
          </div>

          <div className="card shadow" onClick={onOpenBeneficios} style={{ cursor: "pointer", position: "relative" }}>
            {beneficiosNuevos && <span className="bell-badge">1</span>}
            <span>mis beneficios</span>
            🎁
          </div>

          {isAdmin && (
            <div className="card shadow" onClick={onOpenAdmin} style={{ cursor: "pointer" }}>
              <span>Panel Admin</span>
              ⚙️
            </div>
          )}

        </div>
      </main>

      <footer className="home4-footer">
        <a href="https://superelcondor.com.ar/" target="_blank" rel="noopener noreferrer" className="footer-link">
          <div className="footer-item">🛒 <span>Minorista</span></div>
        </a>

        <a href="https://mayoristaelcondor.com.ar/" target="_blank" rel="noopener noreferrer" className="footer-link">
          <div className="footer-item">📦 <span>Mayorista</span></div>
        </a>

        <div className="footer-item red">❓ <span>Preguntas</span></div>
        <div className="footer-item">🔒 <span>Privacidad</span></div>
      </footer>

    </div>
  );
}

export default HomeDashboard;