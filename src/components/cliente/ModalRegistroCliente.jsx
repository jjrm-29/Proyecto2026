import React, { useState } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col
} from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => {

  const [deshabilitado, setDeshabilitado] =
    useState(false);

  const handleRegistrar = async () => {

    if (deshabilitado) return;

    setDeshabilitado(true);

    await agregarCliente();

    setDeshabilitado(false);

  };

  return (

    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
      contentClassName="modal-app"
    >

      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus-fill"></i>
          Registrar Cliente
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="modal-body__intro">
          <h5>Información del Cliente</h5>
          <p>Completa los datos para registrar un nuevo cliente.</p>
        </div>

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_cliente"
                  value={nuevoCliente.nombre_cliente}
                  onChange={manejoCambioInput}
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
                  value={nuevoCliente.apellido_cliente}
                  onChange={manejoCambioInput}
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
              value={nuevoCliente.celular}
              onChange={manejoCambioInput}
              placeholder="Ej: 8888 9999"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModal(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={
            !nuevoCliente.nombre_cliente.trim() ||
            !nuevoCliente.celular.trim() ||
            deshabilitado
          }
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Guardar Cliente
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default ModalRegistroCliente;
