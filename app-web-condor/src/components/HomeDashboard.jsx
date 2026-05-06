import { useEffect, useState, useRef } from "react";
import "./HomeDashboard.css";

/* 🔥 CHAT */
const user = JSON.parse(localStorage.getItem("user"));

const chatFlow = {

  inicio: {
    texto: `¡Hola ${user?.nombre || ""}! 👋 Mi nombre es Coni ¿En qué te puedo ayudar hoy?`,
    opciones: [
      { label: "Mi cuenta", next: "miCuenta" },
      { label: "Puntos", next: "puntosMenu" },
      { label: "Tarjeta", next: "tarjetaMenu" },
      { label: "Otros", next: "otrosMenu" },
    ],
  },

  miCuenta: {
    texto: "¿Qué necesitás saber sobre tu cuenta?",
    opciones: [
      {
        label: "¿Puedo modificar mis datos?",
        next: "modificarDatos"
      },

      {
        label: "¿Puedo eliminar mi cuenta?",
        next: "eliminarCuenta"
      },

      {
        label: "¿Qué pasa si elimino accidentalmente mi cuenta?",
        next: "eliminarAccidental"
      },

      {
        label: "Olvidé mi contraseña",
        next: "olvidePass"
      },

      {
        label: "Cambié de celular",
        next: "cambioCelular"
      },
    ],
  },

  puntosMenu: {
    texto: "¿Qué necesitás saber sobre tus puntos?",
    opciones: [
      {
        label: "¿Para qué sirven los puntos?",
        next: "paraQuePuntos"
      },

      {
        label: "¿Cómo acumulo puntos?",
        next: "acumuloPuntos"
      },

      {
        label: "¿Cómo canjeo mis puntos?",
        next: "canjeoPuntos"
      },

      {
        label: "¿Los puntos vencen?",
        next: "vencenPuntos"
      },

      {
        label: "Mis puntos no aparecen",
        next: "errorPuntos"
      },
    ],
  },

  tarjetaMenu: {
    texto: "¿Qué necesitás saber sobre tu tarjeta?",
    opciones: [
      {
        label: "¿Existe una tarjeta física?",
        next: "tarjetaFisica"
      },

      {
        label: "¿Puedo usar mi tarjeta en cualquier sucursal?",
        next: "usarTarjeta"
      },

      {
        label: "¿Qué pasa si pierdo mi tarjeta física?",
        next: "pierdoTarjeta"
      },
    ],
  },

  otrosMenu: {
    texto:
      "Para resolver cualquier otra inquietud podés acercarte a Casa Central o comunicarte con nosotros 😊",

    
  },

  modificarDatos: {
    texto:
      "Sí 😊 Podés mantener tu información actualizada sin problemas.\n\nIngresá al botón “Privacidad” desde la pantalla principal para editar tus datos.",

    
  },

  eliminarCuenta: {
    texto:
      "Sí, podés eliminar tu cuenta desde la sección “Privacidad” presionando el botón rojo “Eliminar cuenta”.",

    
  },

  eliminarAccidental: {
    texto:
      "Si eliminás tu cuenta, todos tus datos serán borrados automáticamente, incluyendo puntos y beneficios acumulados.",

    
  },

  olvidePass: {
    texto:
      "Si olvidaste tu contraseña, utilizá la opción “Recuperar contraseña” dentro de la app para restablecer el acceso.",

    
  },

  cambioCelular: {
    texto:
      "Podés seguir usando tu cuenta sin problemas 😊\n\nSolo iniciá sesión nuevamente y tus datos seguirán guardados.",

    
  },

  paraQuePuntos: {
    texto:
      "Podés utilizar tus puntos para acceder a descuentos, beneficios especiales y promociones exclusivas 😊",

    
  },

  acumuloPuntos: {
    texto:
      "Para acumular puntos debés presentar tu tarjeta o número de cliente en cada compra.\n\nTambién podés sumar puntos en compras online 😊",

   
  },

  canjeoPuntos: {
    texto:
      "Tus puntos pueden canjearse por beneficios y promociones especiales disponibles dentro de la app 😊",

    
  },

  vencenPuntos: {
    texto:
      "Los puntos pueden tener vencimiento dependiendo de las promociones vigentes.",

    
  },

  tarjetaFisica: {
    texto:
      "Sí 😊 Se entrega tarjeta física a clientes que tengan dificultades para usar la app.",

    
  },

  usarTarjeta: {
    texto:
      "Sí 😊 Tu tarjeta funciona en todas las sucursales de Súper El Cóndor.",

    
  },

  pierdoTarjeta: {
    texto:
      "Deberás acercarte a Casa Central para solicitar la reposición de tu tarjeta física 😊",

    
  },

  errorPuntos: {
    texto:
      "Puede pasar si no presentaste la tarjeta. Recordá que los puntos se verán reflejados dentro de las 24 hs posteriores a tu compra 😊",

    
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
  const [preguntasUsadas, setPreguntasUsadas] = useState([]);
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

    setPreguntasUsadas((prev) => [...prev, op.label]);
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

    // MENSAJE BOT
    {
      from: "bot",
      text: next.texto,

      // 🔥 ESTA ES LA CLAVE
      opciones: next.opciones || [],
    },

    // CTA OPCIONAL
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
        <div className="user-section" >
          <img src="/logo1.png" alt="logo" className="header-logo" />
          <h2 className="user-name">Hola {userName}!</h2>
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
    <span className="quick-label">Mi tarjeta</span>
  </div>

  <div className="quick-item" onClick={onOpenOfertas}>
    <div className="quick-icon">
      <img src="/icono-peso.png" alt="ofertas" />
      {ofertasNuevas && <span className="notif-badge">1</span>}
    </div>
    <span className="quick-label">Ofertas</span>
  </div>

  <div className="quick-item" onClick={onOpenPuntos}>
    <div className="quick-icon">
      <img src="/icono-estrella.png" alt="puntos" />
      {puntosNuevos && <span className="notif-badge">1</span>}
    </div>
    <span className="quick-label">Puntos</span>
  </div>

  <div className="quick-item" onClick={onOpenBeneficios}>
    <div className="quick-icon">
      <img src="/icono-regalo.png" alt="beneficios" />
      {beneficiosNuevos && <span className="notif-badge">1</span>}
    </div>
    <span className="quick-label">Mis beneficios</span>
  </div>

  {isAdmin && (
    <div className="quick-item" onClick={onOpenAdmin}>
      <div className="quick-icon">⚙️</div>
      <span className="quick-label">Admin</span>
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
  

  <img src="/logo1.png" alt="logo" className="chat-logo" />

  <div className="chat-title">
    <img src="/avatar-02.webp" alt="Coni" className="chat-header-avatar" />
    <span>Hablemos</span>
  </div>

  <button
    className="chat-close"
    onClick={() => setChatAbierto(false)}
  >
    volver
  </button>
</div>
<div className="chat-messages">

  {historial.map((msg, i) => {

    // 🔥 BOTÓN CTA
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
            <img
              src="/avatar-02.webp"
              className="avatar"
              alt="avatar"
            />
          </div>
        )}

        <div className="msg-content">

          <div className={`msg ${msg.from}`}>
            {msg.text}
          </div>

          {/* 🔥 SUBPREGUNTAS DENTRO DEL CHAT */}
{msg.from === "bot" && msg.opciones && (
  <div className="chat-inline-options">

    {msg.opciones
      .filter((op) => !preguntasUsadas.includes(op.label))
      .map((op, index) => (

        <button
          key={index}
          className="chat-option-btn"
          onClick={() => handleOption(op)}
        >
          {op.label}
        </button>

      ))}

  </div>
)}

        </div>

      </div>
    );
  })}

  {escribiendo && (
    <div className="msg-row bot">

      <div className="avatar-block">
        <img
          src="/avatar-02.webp"
          className="avatar"
          alt="avatar"
        />
        <span className="avatar-name">Coni</span>
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

{/* 🔥 MENÚ PRINCIPAL FIJO ABAJO */}
<div className="chat-fixed-menu">

  {chatFlow.inicio.opciones.map((op, index) => (

    <button
      key={index}
      className="chat-fixed-btn"
      onClick={() => handleOption(op)}
    >
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
          <span>Terminos y Condicines</span>
        </div>

        <div className="footer-item" onClick={onOpenEditarPerfil}>
  <img src="/icono-candado.png" alt="privacidad" />
  <span>Privacidad</span>
</div>
      </footer>
    </div>
  );
}

export default HomeDashboard;