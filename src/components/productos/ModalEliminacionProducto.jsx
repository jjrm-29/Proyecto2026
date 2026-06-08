import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProducto = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    eliminarProducto,
    producto,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await eliminarProducto();
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
                    <h4>¿Eliminar producto?</h4>
                    <p className="text-muted mb-2">Esta acción no se puede deshacer.</p>
                    <p className="nombre-destacado mb-0">{producto?.nombre_producto}</p>
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
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionProducto;