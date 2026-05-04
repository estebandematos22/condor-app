import { useEffect, useRef, useState } from "react";
import "./ChatModal.css";

export default function ChatModal({ onClose, chatFlow }) {
  const [chatPaso, setChatPaso] = useState("inicio");
  const [historial, setHistorial] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // mensaje inicial del bot
    const inicio = chatFlow["inicio"];
    setHistorial([{ from: "bot", text: inicio?.texto || "" }]);
  }, [chatFlow]);

  useEffect(() => {
    // autoscroll
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial]);

  const handleOption = (op) => {
    // mensaje del usuario
    setHistorial((prev) => [...prev, { from: "user", text: op.label }]);

    if (op.next === "cerrar") {
      setTimeout(() => onClose(), 300);
      return;
    }

    const next = chatFlow[op.next];

    if (!next) return;

    // respuesta del bot
    setTimeout(() => {
      setHistorial((prev) => [
        ...prev,
        { from: "bot", text: next.texto },
      ]);
      setChatPaso(op.next);
    }, 300);
  };

  const opciones = chatFlow[chatPaso]?.opciones || [];

  return (
    <div className="chat-modal">

      {/* HEADER */}
      <div className="chat-title">
  <img src="/icono-mensaje.png" className="chat-icon" />
  <span>Hablemos</span>
</div>

      {/* MENSAJES */}
      <div className="chat-messages">
  {historial.map((msg, i) => (
    <div key={i} className={`msg-row ${msg.from}`}>

  {msg.from === "bot" ? (
    <div className="bot-container">

      <div className="avatar-top">
        <img src="/avatar.png" className="avatar" />
        <span className="avatar-name"></span>

        
      </div>

      <div className="msg bot">
        {msg.text}
      </div>

    </div>
  ) : (
    <div className="msg user">
      {msg.text}
    </div>
  )}

</div>
  ))}

  <div ref={scrollRef} />
</div>

      {/* OPCIONES */}
      <div className="chat-options">
        {opciones.map((op, i) => (
          <button key={i} onClick={() => handleOption(op)}>
            {op.label}
          </button>
        ))}
      </div>

    </div>
  );
}