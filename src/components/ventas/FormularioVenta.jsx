import React, { useState } from "react";
import { Modal, Row, Col, Form, Button, Card, ListGroup } from "react-bootstrap";

const FormularioVenta = ({
  mostrar,
  setMostrar,
  clientes,
  empleados,
  productos,
  clienteSeleccionado,
  setClienteSeleccionado,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  metodoPago,
  setMetodoPago,
  detalles,
  totalGeneral,
  agregarDetalle,
  eliminarDetalle,
  actualizarCantidad,
  guardarVenta,
  ventaAEditar
}) => {

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const handleAgregar = () => {
    if (productoSeleccionado && cantidad > 0) {
      agregarDetalle(productoSeleccionado, cantidad);
      setCantidad(1);
      setProductoSeleccionado(null);
    }
  };

  return (
    <Modal
      show={mostrar}
      onHide={() => setMostrar(false)}
      backdrop="static"
      size="xl"
      centered
      contentClassName="modal-app modal-app--venta"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-receipt-cutoff"></i>
          {ventaAEditar ? "Editar Venta" : "Nueva Venta"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-4">

          {/* === FORMULARIO === */}
          <Col lg={7} md={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
                background: "#ffffff"
              }}
            >
              <Card.Body className="p-4">

                <h5
                  className="fw-bold mb-4"
                  style={{ color: "#1e3a8a" }}
                >
                  Datos de la Venta
                </h5>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    Cliente *
                  </Form.Label>

                  <Form.Select
                    style={{
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid #dbe3ef"
                    }}
                    value={clienteSeleccionado?.id_cliente || ""}
                    onChange={(e) => {
                      const cliente = clientes.find(
                        c => c.id_cliente === Number(e.target.value)
                      );
                      setClienteSeleccionado(cliente);
                    }}
                  >
                    <option value="">Seleccionar cliente...</option>

                    {clientes.map(cli => (
                      <option
                        key={cli.id_cliente}
                        value={cli.id_cliente}
                      >
                        {cli.nombre_cliente} {cli.apellido_cliente} - {cli.celular}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    Empleado / Mesero *
                  </Form.Label>

                  <Form.Select
                    style={{
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid #dbe3ef"
                    }}
                    value={empleadoSeleccionado?.id_empleado || ""}
                    onChange={(e) => {
                      const emp = empleados.find(
                        em => em.id_empleado === Number(e.target.value)
                      );
                      setEmpleadoSeleccionado(emp);
                    }}
                  >
                    <option value="">Seleccionar empleado...</option>

                    {empleados.map(emp => (
                      <option
                        key={emp.id_empleado}
                        value={emp.id_empleado}
                      >
                        {emp.nombre_empleado} {emp.apellido_empleado}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    Método de Pago
                  </Form.Label>

                  <Form.Select
                    style={{
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid #dbe3ef"
                    }}
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </Form.Select>
                </Form.Group>

                <div
                  className="my-4"
                  style={{
                    borderTop: "1px solid #e5e7eb"
                  }}
                ></div>

                <h5
                  className="fw-bold mb-4"
                  style={{ color: "#1e3a8a" }}
                >
                  Agregar Producto
                </h5>

                <Row className="align-items-end g-3">

                  <Col sm={6}>
                    <Form.Label className="fw-semibold text-secondary">
                      Producto
                    </Form.Label>

                    <Form.Select
                      style={{
                        borderRadius: "12px",
                        padding: "12px",
                        border: "1px solid #dbe3ef"
                      }}
                      value={productoSeleccionado?.id_producto || ""}
                      onChange={(e) => {
                        const prod = productos.find(
                          p => p.id_producto === Number(e.target.value)
                        );
                        setProductoSeleccionado(prod);
                      }}
                    >
                      <option value="">Seleccionar producto...</option>

                      {productos.map(p => (
                        <option
                          key={p.id_producto}
                          value={p.id_producto}
                        >
                          {p.nombre_producto} - C${p.precio_venta}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col sm={3}>
                    <Form.Label className="fw-semibold text-secondary">
                      Cantidad
                    </Form.Label>

                    <Form.Control
                      style={{
                        borderRadius: "12px",
                        padding: "12px",
                        border: "1px solid #dbe3ef"
                      }}
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) =>
                        setCantidad(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                    />
                  </Col>

                  <Col sm={3}>
                    <Button
                      variant="success"
                      className="w-100 fw-semibold border-0"
                      style={{
                        borderRadius: "12px",
                        padding: "12px",
                        background:
                          "linear-gradient(135deg, #16a34a, #22c55e)"
                      }}
                      onClick={handleAgregar}
                      disabled={!productoSeleccionado}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Agregar
                    </Button>
                  </Col>

                </Row>

              </Card.Body>
            </Card>
          </Col>

          {/* === DETALLES === */}
          <Col lg={5} md={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
                overflow: "hidden"
              }}
            >
              <Card.Header
                className="border-0 py-3"
                style={{
                  background:
                    "linear-gradient(135deg, #1e293b, #334155)",
                  color: "#fff"
                }}
              >
                <strong>
                  <i className="bi bi-cart-check me-2"></i>
                  Productos en esta venta
                </strong>
              </Card.Header>

              <Card.Body
                className="p-0"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  background: "#fff"
                }}
              >
                {detalles.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i
                      className="bi bi-cart-x"
                      style={{
                        fontSize: "55px",
                        color: "#94a3b8"
                      }}
                    ></i>

                    <p className="mt-3 fw-semibold">
                      No hay productos agregados aún
                    </p>
                  </div>
                ) : (
                  <ListGroup variant="flush">

                    {detalles.map((det) => (
                      <ListGroup.Item
                        key={det.id_producto}
                        className="border-0 px-4 py-3"
                        style={{
                          borderBottom: "1px solid #f1f5f9"
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">

                          <div>
                            <div className="fw-semibold text-dark">
                              {det.nombre_producto}
                            </div>

                            <small className="text-muted">
                              {det.cantidad} × C${det.precio}
                            </small>
                          </div>

                          <div className="text-end">
                            <div
                              className="fw-bold"
                              style={{
                                color: "#16a34a",
                                fontSize: "17px"
                              }}
                            >
                              C$ {(det.cantidad * det.precio).toFixed(2)}
                            </div>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mt-2"
                              style={{
                                borderRadius: "10px"
                              }}
                              onClick={() =>
                                eliminarDetalle(det.id_producto)
                              }
                            >
                              <i className="bi bi-trash me-1"></i>
                              Eliminar
                            </Button>
                          </div>

                        </div>
                      </ListGroup.Item>
                    ))}

                  </ListGroup>
                )}
              </Card.Body>

              <Card.Footer
                className="border-0 py-4"
                style={{
                  background: "#f8fafc"
                }}
              >
                <div className="d-flex justify-content-between align-items-center">

                  <span
                    className="fw-bold"
                    style={{
                      fontSize: "22px",
                      color: "#1e293b"
                    }}
                  >
                    Total:
                  </span>

                  <span
                    className="fw-bold"
                    style={{
                      fontSize: "30px",
                      color: "#16a34a"
                    }}
                  >
                    C$ {totalGeneral.toFixed(2)}
                  </span>

                </div>
              </Card.Footer>

            </Card>
          </Col>

        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrar(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={guardarVenta}
          disabled={
            !clienteSeleccionado ||
            !empleadoSeleccionado ||
            detalles.length === 0
          }
        >
          <i className="bi bi-check-circle me-2"></i>
          {ventaAEditar ? "Actualizar Venta" : "Registrar Venta"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioVenta;