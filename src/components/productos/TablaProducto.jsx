import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
    productos,
    abrirModalEdicion,
    abrirModalEliminacion,
    generarQRImagen
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productos && productos.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [productos]);

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <h4>Cargando productos...</h4>
                    <Spinner animation="border" variant="success" />
                </div>
            ) : (
                <div className="tabla-contenedor">
                <Table hover responsive className="tabla-app mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th className="d-none d-md-table-cell">Descripción</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Imagen</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id_producto}>
                                <td className="fw-semibold">#{producto.id_producto}</td>
                                <td className="fw-semibold">{producto.nombre_producto}</td>
                                <td className="d-none d-md-table-cell text-secondary">
                                    {producto.descripcion_producto}
                                </td>
                                <td>{producto.categoria_producto}</td>
                                <td className="fw-semibold text-primary">C$ {producto.precio_venta}</td>
                                <td>
                                    {producto.url_imagen && (
                                        <Image
                                            src={producto.url_imagen}
                                            alt="img"
                                            width={40}
                                            height={40}
                                            rounded
                                            className="border"
                                        />
                                    )}
                                </td>
                                <td className="text-center">
                                    <Button
                                        size="sm"
                                        className="btn-accion-tabla btn-accion-tabla--editar me-1"
                                        onClick={() => abrirModalEdicion(producto)}
                                        aria-label="Editar"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="btn-accion-tabla btn-accion-tabla--eliminar"
                                        onClick={() => abrirModalEliminacion(producto)}
                                        aria-label="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="btn-accion-tabla btn-accion-tabla--qr"
                                        onClick={() => generarQRImagen(producto)}
                                        aria-label="Generar QR"
                                    >
                                        <i className="bi bi-qrcode"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            )}
        </>
    );
};

export default TablaProductos;