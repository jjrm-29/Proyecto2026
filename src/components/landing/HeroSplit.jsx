import React, { useCallback, useEffect, useRef, useState } from "react";

const HeroSplit = ({
  panelIzquierdo,
  panelDerecho,
  activo = true,
  variante = "login",
  className = "",
}) => {
  const marcoRef = useRef(null);
  const [ratio, setRatio] = useState(variante === "login" ? 54 : 58);
  const [interactivo, setInteractivo] = useState(false);
  const [enfocado, setEnfocado] = useState(null);

  const tienePanelDerecho = Boolean(panelDerecho);

  useEffect(() => {
    const consultar = () => {
      const ancho = window.innerWidth;
      const puedeInteractuar = ancho >= 992 && tienePanelDerecho;
      setInteractivo(puedeInteractuar);

      if (!puedeInteractuar) {
        setRatio(100);
        setEnfocado(null);
      }
    };

    consultar();
    window.addEventListener("resize", consultar);
    return () => window.removeEventListener("resize", consultar);
  }, [tienePanelDerecho]);

  const actualizarRatio = useCallback(
    (clientX) => {
      if (!interactivo || !marcoRef.current) return;

      const rect = marcoRef.current.getBoundingClientRect();
      const porcentaje = ((clientX - rect.left) / rect.width) * 100;
      const minimo = variante === "login" ? 38 : 42;
      const maximo = variante === "login" ? 68 : 72;
      const limitado = Math.min(maximo, Math.max(minimo, porcentaje));

      setRatio(limitado);
    },
    [interactivo, variante]
  );

  const manejarMovimiento = (evento) => {
    if (!interactivo) return;
    actualizarRatio(evento.clientX);
  };

  const manejarToque = (evento) => {
    if (!interactivo || !evento.touches?.[0]) return;
    actualizarRatio(evento.touches[0].clientX);
  };

  const ratioVisual =
    enfocado === "izq"
      ? variante === "login"
        ? 62
        : 66
      : enfocado === "der"
        ? variante === "login"
          ? 42
          : 46
        : ratio;

  const clasesPanelIzq =
    variante === "login"
      ? "hero-split__panel--izq login-visual"
      : "hero-split__panel--izq vista-hero__panel vista-hero__panel--info";

  const clasesPanelDer =
    variante === "login"
      ? "hero-split__panel--der login-tarjeta"
      : "hero-split__panel--der vista-hero__panel vista-hero__panel--acciones";

  return (
    <div
      className={`hero-split hero-split--${variante} ${
        activo ? "hero-split--activo" : ""
      } ${interactivo ? "hero-split--interactivo" : ""} ${
        enfocado ? `hero-split--enfocado-${enfocado}` : ""
      } ${!tienePanelDerecho ? "hero-split--solo-panel" : ""} ${className}`.trim()}
      style={{ "--split-ratio": `${ratioVisual}%` }}
      onMouseMove={manejarMovimiento}
      onTouchMove={manejarToque}
      onMouseLeave={() => setEnfocado(null)}
    >
      <div ref={marcoRef} className="hero-split__marco">
        <section
          className={`hero-split__panel ${clasesPanelIzq}`}
          aria-label={variante === "login" ? "Presentación del sistema" : "Información de la vista"}
          onMouseEnter={() => interactivo && setEnfocado("izq")}
        >
          {panelIzquierdo}
        </section>

        {tienePanelDerecho && (
          <>
            <div className="hero-split__divisor" aria-hidden="true">
              <span className="hero-split__control">
                <i className="bi bi-arrows-expand-vertical"></i>
              </span>
            </div>

            <section
              className={`hero-split__panel ${clasesPanelDer}`}
              aria-label={variante === "login" ? "Formulario de acceso" : "Acciones de la vista"}
              onMouseEnter={() => interactivo && setEnfocado("der")}
            >
              {panelDerecho}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSplit;
