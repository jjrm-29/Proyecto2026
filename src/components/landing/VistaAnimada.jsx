import React from "react";
import { Container, Spinner } from "react-bootstrap";
import useAnimacionEntrada from "../../hooks/useAnimacionEntrada";
import EncabezadoVista from "./EncabezadoVista";
import FadeEscalonado from "./FadeEscalonado";

const VistaAnimada = ({
  titulo,
  subtitulo,
  icono,
  badge,
  acciones,
  children,
  panel = true,
  fluid = false,
  className = "",
  contenidoClassName = "",
  cargando = false,
  cargandoTexto = "Cargando...",
  mostrarHero = true,
  heroClassName = "",
}) => {
  const animar = useAnimacionEntrada();

  if (cargando) {
    return (
      <Container
        fluid={fluid}
        className={`vista-contenedor vista-animada text-center mt-5 ${className}`.trim()}
      >
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3 text-muted">{cargandoTexto}</p>
      </Container>
    );
  }

  const contenido = children ? (
    <FadeEscalonado
      activo={animar}
      delayBase={0.22}
      delayStep={0.07}
      className={`vista-contenido-animado ${contenidoClassName}`.trim()}
    >
      {children}
    </FadeEscalonado>
  ) : null;

  return (
    <Container
      fluid={fluid}
      className={`vista-contenedor vista-animada ${
        animar ? "vista-animada--activa" : ""
      } mt-3 ${className}`.trim()}
    >
      {mostrarHero && titulo && (
        <EncabezadoVista
          titulo={titulo}
          subtitulo={subtitulo}
          icono={icono}
          badge={badge}
          acciones={acciones}
          animar={animar}
          className={heroClassName}
        />
      )}

      {panel ? <div className="vista-panel">{contenido}</div> : contenido}
    </Container>
  );
};

export default VistaAnimada;
