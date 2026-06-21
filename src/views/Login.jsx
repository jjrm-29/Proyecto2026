import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import FormularioLogin from "../components/Login/FormularioLogin";
import FadeEscalonado from "../components/landing/FadeEscalonado";
import HeroSplit from "../components/landing/HeroSplit";
import TextoKinetico from "../components/landing/TextoKinetico";
import useAnimacionEntrada from "../hooks/useAnimacionEntrada";
import { supabase } from "../database/supabaseconfig";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const animar = useAnimacionEntrada();
  const navegar = useNavigate();

  useEffect(() => {
    const correoGuardado = localStorage.getItem("correo-recordado");
    if (correoGuardado) {
      setUsuario(correoGuardado);
      setRecordarme(true);
    }
  }, []);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navegar("/");
    }
  }, [navegar]);

  const iniciarSesion = async () => {
    try {
      if (!usuario || !contrasena) {
        setError("Completa todos los campos");
        return;
      }

      setError(null);
      setCargando(true);

      const { data, error: errorSupabase } = await supabase.auth.signInWithPassword({
        email: usuario.trim().toLowerCase(),
        password: contrasena,
      });

      if (errorSupabase) {
        setError("Usuario o contrasena incorrectos");
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

  const metricas = [
    { icono: "bi-basket2", texto: "Caja" },
    { icono: "bi-box-seam", texto: "Inventario" },
    { icono: "bi-receipt", texto: "Ventas" },
  ];

  return (
    <div className={`login-pagina ${animar ? "login-pagina--animada" : ""}`}>
      <HeroSplit
        variante="login"
        activo={animar}
        className="login-hero-split"
        panelIzquierdo={
          <>
            <FadeEscalonado activo={animar} delayBase={0.05} delayStep={0.12}>
              <div className="login-pulperia-escena" aria-label="Pulperia animada">
                <div className="pulperia-animada pulperia-animada--login">
                  <div className="pulperia-animada__toldo">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="pulperia-animada__letrero">Pulperia</div>
                  <div className="pulperia-animada__estantes">
                    <span className="producto producto--botella"></span>
                    <span className="producto producto--caja"></span>
                    <span className="producto producto--lata"></span>
                    <span className="producto producto--bolsa"></span>
                    <span className="producto producto--caja producto--pequena"></span>
                    <span className="producto producto--botella producto--alta"></span>
                  </div>
                  <div className="pulperia-animada__mostrador">
                    <span className="pulperia-animada__scanner"></span>
                    <span className="pulperia-animada__bolsa"></span>
                  </div>
                  <div className="pulperia-animada__luces" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="login-visual__texto">
                <span className="login-visual__badge">Pulperia conectada</span>
                <TextoKinetico
                  texto="Control de caja, productos y clientes en un solo lugar"
                  etiqueta="h2"
                  modo="palabras"
                  delay={0.15}
                  activo={animar}
                />
                <p className="login-visual__descripcion">
                  Accede al panel para vender, revisar inventario, consultar reportes
                  y moverte por el sistema con una experiencia clara en celular.
                </p>
              </div>
            </FadeEscalonado>

            <FadeEscalonado
              className="login-visual__metricas"
              activo={animar}
              delayBase={0.55}
              delayStep={0.1}
            >
              {metricas.map((metrica) => (
                <div key={metrica.texto}>
                  <i className={`bi ${metrica.icono}`}></i>
                  <strong>{metrica.texto}</strong>
                </div>
              ))}
            </FadeEscalonado>

            <div className="login-visual__enlace-catalogo">
              <Button
                as={Link}
                to="/catalogo"
                variant="outline-light"
                size="sm"
                className="login-btn-catalogo"
              >
                <i className="bi bi-grid me-2"></i>
                Ver catalogo publico
              </Button>
            </div>
          </>
        }
        panelDerecho={
          <FadeEscalonado activo={animar} delayBase={0.2} delayStep={0.12}>
            <div className="login-tarjeta__marca">
              <TextoKinetico
                texto="Sistema de ventas"
                etiqueta="h1"
                modo="letras"
                delay={0.35}
                activo={animar}
                className="login-tarjeta__titulo-kinetico"
              />
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
          </FadeEscalonado>
        }
      />
    </div>
  );
}

export default Login;
