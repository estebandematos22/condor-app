import { useEffect } from "react";
import "./SplashScreen.css";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    if (!onFinish) return;

    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img
          src="/logo1.png"
          alt="Súper El Cóndor"
          className="splash-logo"
        />
        
        <p className="splash-tagline">
  <span className="linea1">Tu supermercado</span>
  <span className="linea2">Ahora más cerca</span>
</p>
      </div>
    </div>
  );
}

export default SplashScreen;
