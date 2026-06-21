import React from "react";

const TextoKinetico = ({
  texto,
  etiqueta = "span",
  modo = "palabras",
  delay = 0,
  className = "",
  activo = true,
}) => {
  const Etiqueta = etiqueta;
  const unidades =
    modo === "letras"
      ? [...texto]
      : texto.trim().split(/\s+/);

  return (
    <Etiqueta
      className={`texto-kinetico ${activo ? "texto-kinetico--activo" : ""} ${className}`.trim()}
      aria-label={texto}
    >
      {unidades.map((unidad, index) => (
        <span
          key={`${unidad}-${index}`}
          className="texto-kinetico__unidad"
          style={{ "--ki": index, "--kd": delay }}
          aria-hidden={modo === "letras" && unidad === " " ? true : undefined}
        >
          <span className="texto-kinetico__contenido">
            {modo === "letras" ? (unidad === " " ? "\u00A0" : unidad) : unidad}
          </span>
          {modo === "palabras" && index < unidades.length - 1 ? (
            <span className="texto-kinetico__espacio" aria-hidden="true">
              {" "}
            </span>
          ) : null}
        </span>
      ))}
    </Etiqueta>
  );
};

export default TextoKinetico;
