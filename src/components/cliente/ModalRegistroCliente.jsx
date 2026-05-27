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
    >

      <Modal.Header
        closeButton
        className="border-0 pb-0"
        style={{
          background:
            "linear-gradient(135deg, #2563eb, #1e40af)"
        }}
      >

        <Modal.Title className="text-white fw-bold">

          <i className="bi bi-person-plus-fill me-2"></i>

          Registrar Cliente

        </Modal.Title>

      </Modal.Header>

      <Modal.Body
        className="p-4"
        style={{
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)"
        }}
      >

        <div className="mb-4">

          <h5 className="fw-bold text-dark mb-1">

            Información del Cliente

          </h5>

          <p className="text-muted mb-0">

            Completa los datos para registrar un nuevo cliente.

          </p>

        </div>

        <Form>

          <Row>

            <Col md={6}>

              <Form.Group className="mb-4">

                <Form.Label className="fw-semibold text-dark">

                  Nombre *

                </Form.Label>

                <Form.Control
                  type="text"
                  name="nombre_cliente"
                  value={nuevoCliente.nombre_cliente}
                  onChange={manejoCambioInput}
                  placeholder="Ingresa el nombre"
                  className="rounded-4 shadow-sm border-0 py-2 px-3"
                  style={{
                    backgroundColor: "#ffffff"
                  }}
                />

              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-4">

                <Form.Label className="fw-semibold text-dark">

                  Apellido

                </Form.Label>

                <Form.Control
                  type="text"
                  name="apellido_cliente"
                  value={nuevoCliente.apellido_cliente}
                  onChange={manejoCambioInput}
                  placeholder="Ingresa el apellido"
                  className="rounded-4 shadow-sm border-0 py-2 px-3"
                  style={{
                    backgroundColor: "#ffffff"
                  }}
                />

              </Form.Group>

            </Col>

          </Row>

          <Form.Group className="mb-3">

            <Form.Label className="fw-semibold text-dark">

              Celular *

            </Form.Label>

            <Form.Control
              type="tel"
              name="celular"
              value={nuevoCliente.celular}
              onChange={manejoCambioInput}
              placeholder="Ej: 8888 9999"
              className="rounded-4 shadow-sm border-0 py-2 px-3"
              style={{
                backgroundColor: "#ffffff"
              }}
            />

          </Form.Group>

        </Form>

      </Modal.Body>

      <Modal.Footer
        className="border-0 px-4 pb-4"
        style={{
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)"
        }}
      >

        <Button
          variant="light"
          onClick={() => setMostrarModal(false)}
          className="rounded-4 px-4 fw-semibold shadow-sm"
        >

          Cancelar

        </Button>

        <Button
          onClick={handleRegistrar}
          disabled={
            !nuevoCliente.nombre_cliente.trim() ||
            !nuevoCliente.celular.trim() ||
            deshabilitado
          }

          className="rounded-4 px-4 fw-semibold border-0 shadow-sm"

          style={{
            background:
              "linear-gradient(135deg, #2563eb, #1d4ed8)"
          }}
        >

          <i className="bi bi-check-circle-fill me-2"></i>

          Guardar Cliente

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalRegistroCliente;