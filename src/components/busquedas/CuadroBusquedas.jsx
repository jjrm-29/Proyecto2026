import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const CuadroBusquedas = ({
  textBusqueda,
  textoBusqueda,
  manejarCambioBusqueda,
  placeholder = "Buscar...",
}) => {
  const valor = textoBusqueda ?? textBusqueda ?? "";

  return (
    <InputGroup className="cuadro-busqueda">
      <InputGroup.Text>
        <i className="bi bi-search" aria-hidden="true"></i>
      </InputGroup.Text>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={valor}
        onChange={manejarCambioBusqueda}
        aria-label={placeholder}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;
