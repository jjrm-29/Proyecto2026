import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/Login/FormularioLogin";
import { supabase } from "../database/supabaseconfig";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();

  useEffect(() => {
    const correoGuardado = localStorage.getItem("correo-recordado");
    if (correoGuardado) {
      setUsuario(correoGuardado);
      setRecordarme(true);
    }
  }, []);

  const iniciarSesion = async () => {
    try {
      if (!usuario || !contrasena) {
        setError("Completa todos los campos");
        return;
      }

      setError(null);
      setCargando(true);

      const { data, error: errorSupabase } =
        await supabase.auth.signInWithPassword({
          email: usuario.trim().toLowerCase(),
          password: contrasena,
        });

      if (errorSupabase) {
        setError("Usuario o contraseña incorrectos");
        setCargando(false);
        return;
      }

      if (recordarme) {
        localStorage.setItem("correo-recordado", usuario);
      } else {
        localStorage.removeItem("correo-recordado");
      }

      if (data.user) {
        localStorage.setItem("usuario-supabase", data.user.id);
        navegar("/");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error en la solicitud:", err);
    } finally {
      setCargando(false);
    }
  };

  const manejarEnter = (e) => {
    if (e.key === "Enter") {
      iniciarSesion();
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navegar("/");
    }
  }, [navegar]);

  return (
    <div className="login-pagina">
      <div className="login-tarjeta">
        <div className="login-tarjeta__marca">
          <h1>Sistema de ventas</h1>
          <p>Ingresa con tu cuenta de empleado</p>
        </div>

        <FormularioLogin
          usuario={usuario}
          contrasena={contrasena}
          error={error}
          setUsuario={setUsuario}
          setContrasena={setContrasena}
          iniciarSesion={iniciarSesion}
          mostrarPassword={mostrarPassword}
          setMostrarPassword={setMostrarPassword}
          recordarme={recordarme}
          setRecordarme={setRecordarme}
          cargando={cargando}
          manejarEnter={manejarEnter}
        />
      </div>
    </div>
  );
}

export default Login;
