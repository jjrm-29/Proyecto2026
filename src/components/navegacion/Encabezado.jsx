import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

import logo from "../../assets/logo_tpo.webp";
import { supabase } from "../../database/supabaseconfig";
import ChatIA from "../ia/ChatIA";

const Encabezado = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mostrarChatIA, setMostrarChatIA] = useState(false);

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const esLogin = location.pathname === "/login";
    const usuario = localStorage.getItem("usuario-supabase");

    const esCatalogoPublico = location.pathname === "/catalogo" && !usuario;

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
        setShowOffcanvas(false); // Cerrar menú al navegar
    };

    const cerrarSesion = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            localStorage.removeItem("usuario-supabase");
            setShowOffcanvas(false);
            navigate("/login");
        } catch (err) {
            console.error("Error al cerrar sesión:", err.message);
            // Opcional: mostrar toast de error
        }
    };

    // Contenido del menú según si está en login o no
    const renderMenu = () => {
        if (esLogin) {
            return (
                <Nav className="ms-auto pe-3">
                    <Nav.Link onClick={() => manejarNavegacion("/login")}>
                        <i className="bi bi-person-fill-lock me-2"></i>
                        Iniciar sesión
                    </Nav.Link>
                </Nav>
            );
        }

        return (
            <Nav className="ms-auto pe-3 flex-column flex-md-row">
                <Nav.Link onClick={() => manejarNavegacion("/")}>
                    Inicio
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/categorias")}>
                    Categorías
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/productos")}>
                    Productos
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/empleados")}>
                    Empleados
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/clientes")}>
                    Clientes
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/ventas")}>
                    Ventas
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/catalogo")}>
                    Catálogo
                </Nav.Link>
                <Nav.Link onClick={() => manejarNavegacion("/dashboard")}>
                    Dashboard
                </Nav.Link>

                <Nav.Link onClick={() => setMostrarChatIA(true)}>
                    <i className="bi bi-robot me-2"></i>
                    Consultas IA
                </Nav.Link>


                <hr className="d-md-none" />

                <Nav.Link
                    onClick={cerrarSesion}
                    className="text-danger mt-2 mt-md-0"
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar sesión
                </Nav.Link>

                {/* Información del usuario (solo en móvil) */}
                {usuario && (
                    <div className="mt-3 p-3 border rounded d-md-none" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <p className="mb-2">
                            <i className="bi bi-envelope-fill me-2"></i>
                            {usuario.toLowerCase()}
                        </p>
                    </div>
                )}
            </Nav>
        );
    };

    return (
        <Navbar
            expand="md"
            fixed="top"
            className="color-navbar"
            variant="dark"
        >
            <Container>
                {/* Logo / Brand */}
                <Navbar.Brand
                    onClick={() => manejarNavegacion(esCatalogoPublico ? "/catalogo" : "/")}
                    style={{ cursor: "pointer" }}
                >
                    <img
                        src={logo}
                        width="45"
                        height="45"
                        alt="Logo Pulpería"
                    />
                    <span className="color-texto-marca ms-2">Ferretería</span>
                </Navbar.Brand>

                {/* Toggle solo si NO estamos en login */}
                {!esLogin && (
                    <Navbar.Toggle
                        aria-controls="offcanvas-navbar"
                        onClick={() => setShowOffcanvas(true)}
                    />
                )}

                <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />

                {/* Offcanvas (menú móvil) */}
                <Navbar.Offcanvas
                    id="offcanvas-navbar"
                    placement="end"
                    show={showOffcanvas}
                    onHide={() => setShowOffcanvas(false)}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menú Ferreteria</Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        {renderMenu()}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>

        
    );
};

export default Encabezado;