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
      contentClassName="modal-app modal-app--peligro"
    >

      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-trash3-fill"></i>
          Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="modal-confirmacion">
          <div className="modal-confirmacion__icono">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h4>¿Eliminar Cliente?</h4>
          <p className="text-muted mb-2">
            Esta acción eliminará permanentemente al cliente:
          </p>
          <p className="nombre-destacado">
            {cliente?.nombre_cliente} {cliente?.apellido_cliente}
          </p>
          <p className="text-secondary mt-3 mb-0">
            Esta acción no se puede deshacer.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={deshabilitado}
        >
          <i className="bi bi-trash-fill me-2"></i>
          Eliminar Cliente
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default ModalEliminacionCliente;
