import React, { useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categoriaNombre }) => {
    const [mostrarModal, setMostrarModal] = useState(false);

    const descripcion = producto.descripcion_producto || "";
    const previsualizacionTexto =
        descripcion.length > 50
            ? descripcion.substring(0, 50) + "..."
            : descripcion;

    const tieneMasTexto = descripcion.length > 50;

    return (
        <>
            <Card
                className="h-100 overflow-hidden position-relative tarjeta-catalogo"
                role="button"
                tabIndex={0}
                onClick={() => setMostrarModal(true)}
            >
                {/* Imagen */}
                <div className="ratio ratio-1x1 bg-light" style={{ overflow: "hidden" }}>
                    {producto.url_imagen ? (
                        <img
                            src={producto.url_imagen}
                            alt={producto.nombre_producto}
                            className="card-img-top object-fit-cover w-100 h-100"
                            loading="lazy"
                        />
                    ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 bg-secondary-subtle">
                            <i className="bi bi-image text-muted fs-1"></i>
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <Card.Body className="d-flex flex-column p-3">
                    <Card.Title className="h6 fw-bold text-dark mb-2">
                        {producto.nombre_producto}
                    </Card.Title>

                    {descripcion && (
                        <Card.Text className="text-muted small flex-grow-1">
                            {previsualizacionTexto}
                            {tieneMasTexto && (
                                <span className="text-primary ms-1">Leer más</span>
                            )}

                            <div className="mt-2">
                                <Badge bg="secondary" pill>
                                    {categoriaNombre || "Sin categoría"}
                                </Badge>
                            </div>
                        </Card.Text>
                    )}

                    <hr />

                    <div className="mt-auto pt-2">
                        <h4 className="text-primary fw-semibold mb-0">
                            C${parseFloat(producto.precio_venta || 0).toFixed(1)}
                        </h4>
                    </div>
                </Card.Body>
            </Card>

            {/* MODAL */}
            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                size="lg"
                centered
                contentClassName="modal-app"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-box-seam"></i>
                        {producto.nombre_producto}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row g-4">
                        <div className="col-md-5">
                            {producto.url_imagen ? (
                                <img
                                    src={producto.url_imagen}
                                    alt={producto.nombre_producto}
                                    className="img-fluid rounded"
                                />
                            ) : (
                                <div className="bg-secondary-subtle h-100 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-image fs-1"></i>
                                </div>
                            )}
                        </div>

                        <div className="col-md-7">
                            <Badge bg="secondary" className="mb-3">
                                {categoriaNombre || "Sin categoría"}
                            </Badge>

                            <h3 className="text-primary fw-semibold">
                                C${parseFloat(producto.precio_venta || 0).toFixed(1)}
                            </h3>

                            {descripcion && <p className="mt-3">{descripcion}</p>}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TarjetaCatalogo;