import React, { useState } from "react";
import {
  Modal,
  Button
} from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCliente,
  cliente,
}) => {

  const [deshabilitado, setDeshabilitado] =
    useState(false);

  const handleEliminar = async () => {

    if (deshabilitado) return;

    setDeshabilitado(true);

    await eliminarCliente();

    setDeshabilitado(false);

  };

  return (

    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >

      <Modal.Header
        closeButton
        className="border-0 pb-0"
        style={{
          background:
            "linear-gradient(135deg, #7f1d1d, #dc2626)"
        }}
      >

        <Modal.Title className="text-white fw-bold">

          <i className="bi bi-trash3-fill me-2"></i>

          Confirmar Eliminación

        </Modal.Title>

      </Modal.Header>

      <Modal.Body
        className="text-center p-5"
        style={{
          background:
            "linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)"
        }}
      >

        <div
          className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle shadow-sm"
          style={{
            width: "90px",
            height: "90px",
            background:
              "linear-gradient(135deg, #dc2626, #ef4444)"
          }}
        >

          <i
            className="bi bi-exclamation-triangle-fill text-white"
            style={{ fontSize: "2.2rem" }}
          ></i>

        </div>

        <h4 className="fw-bold text-dark mb-3">

          ¿Eliminar Cliente?

        </h4>

        <p className="text-muted mb-1">

          Esta acción eliminará permanentemente al cliente:

        </p>

        <h5 className="fw-bold text-danger">

          {cliente?.nombre_cliente} {cliente?.apellido_cliente}

        </h5>

        <p className="text-secondary mt-3 mb-0">

          Esta acción no se puede deshacer.

        </p>

      </Modal.Body>

      <Modal.Footer
        className="border-0 px-4 pb-4"
        style={{
          background:
            "linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)"
        }}
      >

        <Button
          variant="light"
          onClick={() => setMostrarModalEliminacion(false)}
          className="rounded-4 px-4 fw-semibold shadow-sm"
        >

          Cancelar

        </Button>

        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={deshabilitado}
          className="rounded-4 px-4 fw-semibold shadow-sm border-0"
          style={{
            background:
              "linear-gradient(135deg, #dc2626, #ef4444)"
          }}
        >

          <i className="bi bi-trash-fill me-2"></i>

          Eliminar Cliente

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalEliminacionCliente;