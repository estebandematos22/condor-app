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
  onOpenUbicacion,
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

  const [promoActiva, setPromoActiva] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [notiCount, setNotiCount] = useState(0);

  /*chatt boot */
  const [chatAbierto, setChatAbierto] = useState(false);
  const [puntosNuevos, setPuntosNuevos] = useState(false);
  const [beneficiosNuevos, setBeneficiosNuevos] = useState(false);
  const [ofertasNuevas, setOfertasNuevas] = useState(false);

  const slides = [
    "/proveedores-10.png",
    "/proveedores-07.png",
    "/proveedores-12.png",
    "/proveedores-06.png",
    "/proveedores-13.png",
    "/proveedores-09.png",
    "/proveedores-11.png",
    "/proveedores-08.png",
  ];

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
          <img src="/logo1.png" alt="logo" className="header-logo" />
          <h2 className="user-name">hola {userName}!</h2>
        </div>

        <div
  className="bell-btn"
  onClick={handleOpenNotificaciones}
>
  <img src="/icono-campana.png" alt="notificaciones" />

  {notiCount > 0 && (
    <span className="bell-badge">{notiCount}</span>
  )}
</div>
      </header>

      <main className="home4-content">

        <div className="top-actions">

          <div className="action-btn" onClick={() => setChatAbierto(!chatAbierto)}>
  <img src="/icono-mensajes.png" alt="chat" />
  <span>Hablemos</span>
</div>

          <div className="action-btn" onClick={() => console.log("abrir chat")}>
            <img src="/icono-mensajes.png" alt="chat" />
            <span>Hablemos</span>
          </div>

        </div>

        <div className="quick-access">

          <div className="quick-item" onClick={onOpenMiTarjeta}>
            <div className="quick-icon">
              <img src="/icono-tarjeta.png" alt="tarjeta" />
            </div>
            <span>Mi tarjeta</span>
          </div>

          <div className="quick-item" onClick={onOpenOfertas}>
            {ofertasNuevas && <span className="card-badge">1</span>}
            <div className="quick-icon">
              <img src="/icono-peso.png" alt="ofertas" />
            </div>
            <span>Ofertas</span>
          </div>

          <div className="quick-item" onClick={onOpenPuntos}>
            {puntosNuevos && <span className="card-badge">1</span>}
            <div className="quick-icon">
              <img src="/icono-estrella.png" alt="puntos" />
            </div>
            <span>Puntos</span>
          </div>

          <div className="quick-item" onClick={onOpenBeneficios}>
            {beneficiosNuevos && <span className="card-badge">1</span>}
            <div className="quick-icon">
              <img src="/icono-regalo.png" alt="beneficios" />
            </div>
            <span>Mis beneficios</span>
          </div>

          {/* 🔥 ADMIN RESTAURADO */}
          {isAdmin && (
            <div className="quick-item" onClick={onOpenAdmin}>
              <div className="quick-icon">⚙️</div>
              <span>Admin</span>
            </div>
          )}

        </div>

        <div className="carousel shadow">
          <img
            src={slides[currentSlide]}
            alt="oferta"
            className="slide active"
          />
        </div>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={index === currentSlide ? "active" : ""}
            ></span>
          ))}
        </div>


        {/* 🔥 PROMOS BANCARIAS */}
<div className="promo-section">

  <h3 className="promo-title">Promos bancarias</h3>

  <div className="promo-cards">

  <div className="promo-card" onClick={() => setPromoActiva("/promos-bancarias-01.png")}>
    <img src="/promos-bancarias-01.png" />
  </div>

  <div className="promo-card" onClick={() => setPromoActiva("/promos-bancarias-02.png")}>
    <img src="/promos-bancarias-02.png" />
  </div>

</div>

</div>

      </main>
      {promoActiva && (
  <div className="promo-modal" onClick={() => setPromoActiva(null)}>
    <img src={promoActiva} className="promo-modal-img" />
  </div>
)}

{chatAbierto && (
  <div className="chat-box">
    <h4>¿En qué te podemos ayudar?</h4>

    <div className="chat-option">🛒 ¿Cómo sumo puntos?</div>
    <div className="chat-option">💳 ¿Cómo uso mi tarjeta?</div>
    <div className="chat-option">🎁 ¿Cómo canjeo beneficios?</div>
    <div className="chat-option">📍 ¿Dónde están las sucursales?</div>
  </div>
)}

      <footer className="home4-footer">

  <a
    href="https://superelcondor.com.ar/"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <div className="footer-item">
      <img src="/iconominorista.png" alt="minorista" />
      <span>Minorista</span>
    </div>
  </a>

  <a
    href="https://mayoristaelcondor.com.ar/"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-link"
  >
    <div className="footer-item">
      <img src="/icono-mayorista.png" alt="mayorista" />
      <span>Mayorista</span>
    </div>
  </a>

  <div className="footer-item">
    <img src="/icono-pregunta.png" alt="preguntas" />
    <span>Preguntas</span>
  </div>

  <div className="footer-item">
    <img src="/icono-candado.png" alt="privacidad" />
    <span>Privacidad</span>
  </div>




</footer>
    </div>
  );
}

export default HomeDashboard;