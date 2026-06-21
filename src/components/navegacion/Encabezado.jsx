import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

import logo from "../../assets/logo_tpo.webp";
import { supabase } from "../../database/supabaseconfig";
import ChatIA from "../ia/ChatIA";

const enlaces = [
  { ruta: "/", texto: "Inicio", icono: "bi-house-door" },
  { ruta: "/categorias", texto: "Categorias", icono: "bi-tags" },
  { ruta: "/productos", texto: "Productos", icono: "bi-box-seam" },
  { ruta: "/empleados", texto: "Empleados", icono: "bi-person-badge" },
  { ruta: "/clientes", texto: "Clientes", icono: "bi-people" },
  { ruta: "/ventas", texto: "Ventas", icono: "bi-receipt" },
  { ruta: "/catalogo", texto: "Catalogo", icono: "bi-grid-3x3-gap" },
  { ruta: "/dashboard", texto: "Dashboard", icono: "bi-speedometer2" },
];

const Encabezado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarChatIA, setMostrarChatIA] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const esLogin = location.pathname === "/login";
  const esInicio = location.pathname === "/";
  const usuario = localStorage.getItem("usuario-supabase");
  const esCatalogoPublico = location.pathname === "/catalogo" && !usuario;

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setShowOffcanvas(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("usuario-supabase");
      setShowOffcanvas(false);
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesion:", err.message);
    }
  };

  const renderMenu = () => {
    if (esLogin) {
      return (
        <Nav className="ms-auto pe-3">
          <Nav.Link onClick={() => manejarNavegacion("/login")}>
            <i className="bi bi-person-fill-lock"></i>
            Iniciar sesion
          </Nav.Link>
        </Nav>
      );
    }

    return (
      <Nav className="ms-auto pe-3 nav-principal flex-column flex-xl-row">
        {enlaces.map((enlace) => (
          <Nav.Link
            key={enlace.ruta}
            onClick={() => manejarNavegacion(enlace.ruta)}
            className={location.pathname === enlace.ruta ? "nav-link-activo" : ""}
          >
            <i className={`bi ${enlace.icono}`}></i>
            {enlace.texto}
          </Nav.Link>
        ))}

        <Nav.Link
          onClick={() => {
            setShowOffcanvas(false);
            setMostrarChatIA(true);
          }}
          className="nav-link-ia"
        >
          <i className="bi bi-chat-dots"></i>
          IA
        </Nav.Link>

        <hr className="d-xl-none" />

        <Nav.Link onClick={cerrarSesion} className="nav-link-salida mt-2 mt-xl-0">
          <i className="bi bi-box-arrow-right"></i>
          Salir
        </Nav.Link>

        {usuario && (
          <div className="usuario-menu-resumen d-xl-none">
            <i className="bi bi-envelope-fill"></i>
            <span>{usuario.toLowerCase()}</span>
          </div>
        )}
      </Nav>
    );
  };

  if (esInicio) return null;

  return (
    <Navbar expand="xl" fixed="top" className="color-navbar" variant="dark">
      <Container fluid="xl" className="nav-contenedor">
        <Navbar.Brand
          className="marca-navbar"
          onClick={() => manejarNavegacion(esCatalogoPublico ? "/catalogo" : "/")}
        >
          <img src={logo} className="marca-navbar__logo" alt="Logo Pulperia" />
          <span className="marca-navbar__texto">
            <span className="color-texto-marca">Pulperia</span>
            <small>Sistema de ventas</small>
          </span>
        </Navbar.Brand>

        {esLogin && (
          <Nav className="login-navbar-actions ms-auto">
            <Nav.Link
              onClick={() => manejarNavegacion("/catalogo")}
              className="login-navbar-actions__link"
            >
              <i className="bi bi-grid"></i>
              <span>Catalogo</span>
            </Nav.Link>
            <Nav.Link
              onClick={() => manejarNavegacion("/login")}
              className="login-navbar-actions__link login-navbar-actions__link--activo"
            >
              <i className="bi bi-person-fill-lock"></i>
              <span>Acceder</span>
            </Nav.Link>
          </Nav>
        )}

        {!esLogin && (
          <Navbar.Toggle
            aria-controls="offcanvas-navbar"
            onClick={() => setShowOffcanvas(true)}
          />
        )}

        <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />

        <Navbar.Offcanvas
          id="offcanvas-navbar"
          placement="start"
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <span>Menu Pulperia</span>
              <small>Navegacion principal</small>
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>{renderMenu()}</Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
