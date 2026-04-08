import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/Login/FormularioLogin";
import { supabase } from "../database/supabaseconfig";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);

  const navegar = useNavigate();

  const iniciarSesion = async () => {
    try {

      if (!usuario || !contrasena) {
        setError("Completa todos los campos");
        return;
      }

      const { data, error: errorSupabase } = await supabase.auth.signInWithPassword({
        email: usuario,
        password: contrasena
      });

      if (errorSupabase) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      if (data.user) {
        localStorage.setItem("usuario-supabase", data.user.id);
        navegar("/");
      }

    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error en la solicitud:", err);
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navegar("/");
    }
  }, [navegar]);

  const estiloContenedor = {
    postition: "fixed",
    top: 0,
    left: 0,
    width: "200%",
    height: "108%",
    display: "flex",
    justifycontent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFDEE9, #B5FFFC)",
    overflow: "hidden",
    padding: "200px",
  };

  return (
    <div style={estiloContenedor}>
      <FormularioLogin
        usuario={usuario}
        contrasena={contrasena}
        error={error}
        setUsuario={setUsuario}
        setContrasena={setContrasena}
        iniciarSesion={iniciarSesion}
      />
    </div>
  );
}

export default Login;