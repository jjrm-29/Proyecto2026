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
    >

      <Modal.Header
        closeButton
        className="border-0 pb-0"
        style={{
          background:
            "linear-gradient(135deg, #0f172a, #1e3a8a)"
        }}
      >

        <Modal.Title className="text-white fw-bold">

          <i className="bi bi-pencil-square me-2"></i>

          Editar Cliente

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

            Actualizar Información

          </h5>

          <p className="text-muted mb-0">

            Modifica los datos del cliente seleccionado.

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
                  value={clienteEditar.nombre_cliente}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ingresa el nombre"
                  className="rounded-4 border-0 shadow-sm py-2 px-3"
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
                  value={clienteEditar.apellido_cliente}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ingresa el apellido"
                  className="rounded-4 border-0 shadow-sm py-2 px-3"
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
              value={clienteEditar.celular}
              onChange={manejoCambioInputEdicion}
              placeholder="Ej: 8888 9999"
              className="rounded-4 border-0 shadow-sm py-2 px-3"
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
          onClick={() => setMostrarModalEdicion(false)}
          className="rounded-4 px-4 fw-semibold shadow-sm"
        >

          Cancelar

        </Button>

        <Button
          onClick={handleActualizar}
          disabled={
            !clienteEditar.nombre_cliente?.trim() ||
            !clienteEditar.celular?.trim() ||
            deshabilitado
          }

          className="rounded-4 px-4 fw-semibold border-0 shadow-sm"

          style={{
            background:
              "linear-gradient(135deg, #1d4ed8, #2563eb)"
          }}
        >

          <i className="bi bi-check-circle-fill me-2"></i>

          Actualizar Cliente

        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ModalEdicionCliente;