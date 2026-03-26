import { useState } from "react";

import SplashScreen from "./components/SplashScreen";
import HomeAccess from "./components/HomeAccess";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeDashboard from "./components/HomeDashboard";
import MiTarjeta from "./pages/MiTarjeta";
import EditarPerfil from "./pages/EditProfile";
import Ofertas from "./pages/Ofertas";
import Puntos from "./pages/Puntos";
import MisBeneficios from "./pages/MisBeneficios"; // ✅ ahora usamos el correcto
import AdminPanel from "./pages/AdminPanel";
import Notificaciones from "./pages/Notificaciones";
import Ubicacion from "./pages/Ubicacion";

function App() {

  const [screen, setScreen] = useState("splash");

  // splash | home | register | login | dashboard | mitarjeta | editarperfil | ofertas | puntos | beneficios | admin | notificaciones

  return (
    <>

      {screen === "splash" && (
        <SplashScreen onFinish={() => setScreen("home")} />
      )}

      {screen === "home" && (
        <HomeAccess
          onRegister={() => setScreen("register")}
          onLogin={() => setScreen("login")}
        />
      )}

      {screen === "register" && (
        <Register
          onSuccess={() => setScreen("login")}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "login" && (
        <Login
          onBack={() => setScreen("home")}
          onLoginSuccess={() => setScreen("dashboard")}
        />
      )}

      {screen === "admin" && (
        <AdminPanel onBack={() => setScreen("dashboard")} />
      )}

      {screen === "dashboard" && (
        <HomeDashboard
          onOpenMiTarjeta={() => setScreen("mitarjeta")}
          onOpenEditarPerfil={() => setScreen("editarperfil")}
          onOpenOfertas={() => setScreen("ofertas")}
          onOpenPuntos={() => setScreen("puntos")}
          onOpenBeneficios={() => setScreen("beneficios")}
          onOpenAdmin={() => setScreen("admin")}
          onOpenNotificaciones={() => setScreen("notificaciones")}
          onOpenUbicacion={() => setScreen("ubicacion")}
        />
      )}

      {screen === "mitarjeta" && (
        <MiTarjeta onBack={() => setScreen("dashboard")} />
      )}

      {screen === "editarperfil" && (
        <EditarPerfil onBack={() => setScreen("dashboard")} />
      )}

      {screen === "ofertas" && (
        <Ofertas onBack={() => setScreen("dashboard")} />
      )}

      {screen === "puntos" && (
        <Puntos onBack={() => setScreen("dashboard")} />
      )}

      {screen === "beneficios" && (
        <MisBeneficios onBack={() => setScreen("dashboard")} />
      )}

      {screen === "notificaciones" && (
        <Notificaciones onBack={() => setScreen("dashboard")} />
      )}

      {screen === "ubicacion" && (
        <Ubicacion onBack={() => setScreen("dashboard")} />
      )}

    </>
  );
}

export default App;