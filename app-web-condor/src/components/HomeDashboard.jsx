import { useEffect, useState, useRef } from "react";
import "./HomeDashboard.css";

/* 🔥 CHAT FLOW */
const chatFlow = {
  inicio: {
    texto: "Hola 👋🏼 ¿En qué te puedo ayudar hoy?",
    opciones: [
      { label: "1. Ver mis puntos", next: "verPuntos" },
      { label: "2. Beneficios para mí", next: "promos" },
      { label: "3. Mi tarjeta", next: "tarjeta" },
      { label: "4. Ofertas", next: "Ofertas" },
      { label: "5. Quiero comprar online", next: "Online" },
      { label: "6. Problemas con mi cuenta", next: "problemas" },
    ],
  },

  Ofertas: {
  texto: "¡Mirá todas las ofertas que tenemos para vos! 👇",
  cta: { label: "👉 Ver ofertas", action: "ofertas" },
  opciones: [
    { label: "Volver al menú", next: "inicio" },
    { label: "Salir", next: "cerrar" }
  ]
},

  Online: {
    texto:
      "¡Buenísimo! 🙌 ingresá acá para compra online de forma fácil y rápida 👇",
    opciones: [
      { label: "Volver al menú", next: "inicio" },
      { label: "Salir", next: "cerrar" },
    ],
  },

  verPuntos: {
  texto: "Para ver tus puntos ingresá acá 👇",
  cta: { label: "👉 Ver mis puntos", action: "puntos" },
  opciones: [
    { label: "Volver al menú", next: "inicio" },
    { label: "Salir", next: "cerrar" }
  ]
},

  promos: {
  texto: "Mirá todos los beneficios que tenemos para vos 👇",
  cta: { label: "👉 Ver beneficios", action: "beneficios" },
  opciones: [
    { label: "Volver al menú", next: "inicio" },
    { label: "Salir", next: "cerrar" }
  ]
},

  tarjeta: {
  texto: "Si usás tu tarjeta, podés acceder a un montón de beneficios ✨",
  cta: { label: "👉 Ver mi tarjeta", action: "tarjeta" },
  opciones: [
    { label: "Volver al menú", next: "inicio" },
    { label: "Salir", next: "cerrar" }
  ]
},

  problemas: {
    texto: "Decime qué problema estás teniendo:",
    opciones: [
      { label: "Mis puntos no aparecen", next: "errorPuntos" },
      { label: "Cambié de celular", next: "cambioCel" },
      { label: "Hablar con un asesor", next: "asesor" },
    ],
  },

  errorPuntos: {
    texto:
      "Puede pasar si no presentaste la tarjeta. Recordá que los puntos se verán reflejados en tu cuenta transcurridas las 24 hs desde que realizaste tu última compra 😄",
    opciones: [
      { label: "Volver al menú", next: "inicio" },
      { label: "Salir", next: "cerrar" },
    ],
  },

  cambioCel: {
    texto:
      "¡Podés seguir usando tu cuenta sin problemas! 😄 Solo tenés que iniciar sesión nuevamente y listo. Tus datos están guardados y seguros.",
    opciones: [
      { label: "Volver al menú", next: "inicio" },
      { label: "Salir", next: "cerrar" },
    ],
  },

  asesor: {
    texto:
      "Podés acercarte a Casa Central o escribir al WhatsApp 3755 112233",
    opciones: [
      { label: "Volver al menú", next: "inicio" },
      { label: "Salir", next: "cerrar" },
    ],
  },
};

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

  /* chat */
  const [escribiendo, setEscribiendo] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [chatPaso, setChatPaso] = useState("inicio");
  const [historial, setHistorial] = useState([]);
  const chatEndRef = useRef(null);

  const [puntosNuevos, setPuntosNuevos] = useState(false);
  const [beneficiosNuevos, setBeneficiosNuevos] = useState(false);
  const [ofertasNuevas, setOfertasNuevas] = useState(false);

  /* carrucel  */
  const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null); 

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
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(() => {
    if (chatAbierto) {
      setHistorial([{ from: "bot", text: chatFlow.inicio.texto }]);
      setChatPaso("inicio");
    }
  }, [chatAbierto]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial, escribiendo]);


  const handleTouchStart = (e) => {
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
  if (!touchStart || !touchEnd) return;

  const distance = touchStart - touchEnd;

  // 👉 swipe izquierda
  if (distance > 50) {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  }

  // 👉 swipe derecha
  if (distance < -50) {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  }
};

  const handleOpenNotificaciones = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/notificaciones/${user.id}`
      );
      const data = await res.json();

      localStorage.setItem("notificaciones_vistas", JSON.stringify(data));
      setNotiCount(0);
    } catch (error) {
      console.error(error);
    }

    onOpenNotificaciones();
  };

  const handleOption = (op) => {
    if (op.next === "cerrar") {
      setChatAbierto(false);
      setChatPaso("inicio");
      return;
    }

    setHistorial((prev) => [...prev, { from: "user", text: op.label }]);
    setEscribiendo(true);

    setTimeout(() => {
      if (op.action === "tarjeta") {
        setEscribiendo(false);
        onOpenMiTarjeta();
        return;
      }

      if (op.action === "puntos") {
        setEscribiendo(false);
        onOpenPuntos();
        return;
      }

      if (op.action === "beneficios") {
        setEscribiendo(false);
        onOpenBeneficios();
        return;
      }

      if (op.action === "ofertas") {
        setEscribiendo(false);
        onOpenOfertas();
        return;
      }

      const next = chatFlow[op.next];

if (next) {
  setHistorial(prev => [
    ...prev,
    { from: "bot", text: next.texto },

    // 🔥 AGREGA BOTÓN DENTRO DEL CHAT
    ...(next.cta
      ? [{ from: "bot-cta", cta: next.cta }]
      : [])
  ]);

  setChatPaso(op.next);
}

      setEscribiendo(false);
    }, 1000);
  };

  return (
    <div className="home4-container">
      <header className="home4-header">
        <div className="user-section" onClick={onOpenEditarPerfil}>
          <img src="/logo1.png" alt="logo" className="header-logo" />
          <h2 className="user-name">hola {userName}!</h2>
        </div>

        <div className="bell-btn" onClick={handleOpenNotificaciones}>
          <img src="/icono-campana.png" alt="notificaciones" />

          {notiCount > 0 && (
            <span className="bell-badge">{notiCount}</span>
          )}
        </div>
      </header>

      <main className="home4-content">
        <div className="top-actions">
          <div className="action-btn" onClick={onOpenUbicacion}>
            <img src="/icono-ubicacion.png" alt="ubicacion" />
            <span>Encontranos</span>
          </div>

          <div className="action-btn" onClick={() => setChatAbierto(true)}>
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

          {isAdmin && (
            <div className="quick-item" onClick={onOpenAdmin}>
              <div className="quick-icon">⚙️</div>
              <span>Admin</span>
            </div>
          )}
        </div>

 <div
  className="carousel shadow"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  <img
    src={slides[currentSlide]}
    alt="slide"
    className="slide"
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

        <div className="promo-section">
          <h3 className="promo-title">Promos bancarias</h3>

          <div className="promo-cards">
            <div
              className="promo-card"
              onClick={() => setPromoActiva("/promos-bancarias-01.png")}
            >
              <img src="/promos-bancarias-01.png" />
            </div>

            <div
              className="promo-card"
              onClick={() => setPromoActiva("/promos-bancarias-02.png")}
            >
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
        <div className="chat-modal">
          <div className="chat-header">
            <button
              className="chat-back"
              onClick={() => setChatAbierto(false)}
            >
              ←
            </button>
            <span className="chat-title">Hablemos</span>
            <button
              className="chat-close"
              onClick={() => setChatAbierto(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {historial.map((msg, i) => {

  // 🔥 BOTÓN DENTRO DEL CHAT
  if (msg.from === "bot-cta") {
    return (
      <div key={i} className="msg-row bot">
        <div className="msg bot">
          <button
            className="chat-btn"
            onClick={() => handleOption(msg.cta)}
          >
            {msg.cta.label}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={i} className={`msg-row ${msg.from}`}>

      {msg.from === "bot" && (
        <div className="avatar-block">
          <img src="/avatar.webp" className="avatar" />
          <span className="avatar-name">Martin</span>
        </div>
      )}

      <div className={`msg ${msg.from}`}>
        {msg.text}
      </div>

    </div>
  );
})}

            {escribiendo && (
              <div className="msg-row bot">
                <div className="avatar-block">
                  <img
                    src="/avatar.png"
                    className="avatar"
                    alt="avatar"
                  />
                  <span className="avatar-name">Martín</span>
                </div>

                <div className="msg bot typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-options">
            {chatFlow[chatPaso]?.opciones?.map((op, i) => (
              <button key={i} onClick={() => handleOption(op)}>
                {op.label}
              </button>
            ))}
          </div>
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