import React, { useState } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col
} from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => {

  const [deshabilitado, setDeshabilitado] =
    useState(false);

  const handleActualizar = async () => {

    if (deshabilitado) return;

    setDeshabilitado(true);

    await actualizarCliente();

    setDeshabilitado(false);

  };

  return (

    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
      contentClassName="modal-app"
    >

      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square"></i>
          Editar Cliente
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="modal-body__intro">
          <h5>Actualizar Información</h5>
          <p>Modifica los datos del cliente seleccionado.</p>
        </div>

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_cliente"
                  value={clienteEditar.nombre_cliente}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ingresa el nombre"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido_cliente"
                  value={clienteEditar.apellido_cliente}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ingresa el apellido"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Celular *</Form.Label>
            <Form.Control
              type="tel"
              name="celular"
              value={clienteEditar.celular}
              onChange={manejoCambioInputEdicion}
              placeholder="Ej: 8888 9999"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEdicion(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={
            !clienteEditar.nombre_cliente?.trim() ||
            !clienteEditar.celular?.trim() ||
            deshabilitado
          }
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Actualizar Cliente
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default ModalEdicionCliente;
