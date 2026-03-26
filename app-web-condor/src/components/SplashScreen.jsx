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
          src="/logo.png"
          alt="Súper El Cóndor"
          className="splash-logo"
        />
        
        <p className="splash-tagline">Tu supermercado más cerca</p>
      </div>
    </div>
  );
}

export default SplashScreen;
