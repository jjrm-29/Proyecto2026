import React from "react";
import HeroSplit from "./HeroSplit";
import FadeEscalonado from "./FadeEscalonado";
import TextoKinetico from "./TextoKinetico";

const EncabezadoVista = ({
  titulo,
  subtitulo,
  icono,
  badge,
  acciones,
  animar = true,
  className = "",
}) => {
  const panelIzquierdo = (
    <FadeEscalonado activo={animar} delayBase={0.05} delayStep={0.1}>
      <div className="vista-hero__titulo-grupo">
        {icono && (
          <div className="vista-hero__icono" aria-hidden="true">
            <i className={`bi ${icono}`}></i>
          </div>
        )}
        <div className="vista-hero__texto">
          {badge && <span className="vista-hero__badge">{badge}</span>}
          <TextoKinetico
            texto={titulo}
            etiqueta="h2"
            modo="palabras"
            delay={0.1}
            activo={animar}
            className="vista-hero__titulo-kinetico"
          />
          {subtitulo && (
            <p className="vista-hero__subtitulo">{subtitulo}</p>
          )}
        </div>
      </div>
    </FadeEscalonado>
  );

  const panelDerecho = acciones ? (
    <FadeEscalonado activo={animar} delayBase={0.18} delayStep={0.08}>
      <div className="vista-hero__acciones">{acciones}</div>
    </FadeEscalonado>
  ) : null;

  return (
    <header className={`vista-hero ${className}`.trim()}>
      <HeroSplit
        variante="vista"
        activo={animar}
        panelIzquierdo={panelIzquierdo}
        panelDerecho={panelDerecho}
      />
    </header>
  );
};

export default EncabezadoVista;
