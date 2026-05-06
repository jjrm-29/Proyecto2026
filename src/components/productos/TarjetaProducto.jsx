import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import TablaProductos from "./TablaProducto";

const TarjetasProductos = ({
  productos,
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(productos && productos.length > 0));
  }, [productos]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const obtenerNombreCategoria = (idCategoria) => {
    const cat = categorias.find((c) => c.id_categoria === idCategoria);
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando productos...</h5>
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      ) : (
        <div>
          {productos.map((prod) => {
            const tarjetaActiva = idTarjetaActiva === prod.id_producto;

            return (
              <Card
                key={prod.id_producto}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-producto-contenedor"
                onClick={() => alternarTarjetaActiva(prod.id_producto)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(prod.id_producto);
                  }
                }}
                aria-label={`Producto ${prod.nombre_producto}`}
              >
                <Card.Body
                  className={`p-2 tarjeta-producto-cuerpo ${
                    tarjetaActiva
                      ? "tarjeta-producto-cuerpo-activo"
                      : "tarjeta-producto-cuerpo-inactivo"
                  }`}
                >
                  <Row className="align-items-center gx-3">
                    <Col xs={2} className="px-2">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-producto-placeholder-imagen">
                        {prod.url_imagen ? (
                          <img
                            src={prod.url_imagen}
                            alt={prod.nombre_producto}
                            style={{
                              maxWidth: "60px",
                              maxHeight: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <i className="bi bi-box-seam text-muted fs-3"></i>
                        )}
                      </div>
                    </Col>

                    <Col xs={5} className="text-start">
                      <div className="fw-semibold text-truncate">
                        {prod.nombre_producto}
                      </div>
                      <div className="small text-muted text-truncate">
                        {obtenerNombreCategoria(prod.categoria_producto)}
                      </div>
                    </Col>

                    <Col
                      xs={5}
                      className="d-flex flex-column align-items-end justify-content-center text-end"
                    >
                      <div className="fw-semibold small">
                        ${prod.precio_venta}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    className="tarjeta-producto-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-producto-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(prod);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${prod.nombre_producto}`}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(prod);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${prod.nombre_producto}`}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetasProductos;
