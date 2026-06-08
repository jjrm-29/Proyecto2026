import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEmpleados = ({
    empleados,
    abrirModalEdicion
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (empleados && empleados.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [empleados]);

    return (
        <>
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" role="status" />
                    <p className="mt-3 text-secondary mb-0">Cargando empleados...</p>
                </div>
            ) : (
                <div className="tabla-contenedor">
                    <Table hover responsive className="tabla-app mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th className="d-none d-md-table-cell">Celular</th>
                                <th className="d-none d-md-table-cell">PIN</th>
                                <th className="d-none d-md-table-cell">Rol</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((empleado) => (
                                <tr key={empleado.id_empleado} className="align-middle">
                                    <td className="fw-semibold">#{empleado.id_empleado}</td>
                                    <td className="fw-semibold">{empleado.nombre_empleado}</td>
                                    <td>{empleado.apellido_empleado}</td>
                                    <td className="text-secondary">{empleado.email}</td>
                                    <td className="d-none d-md-table-cell">{empleado.celular || "—"}</td>
                                    <td className="d-none d-md-table-cell">{empleado.pin || "—"}</td>
                                    <td className="d-none d-md-table-cell">
                                        <span className="badge rounded-pill" style={{ background: "var(--gradient-primary)" }}>
                                            {empleado.tipo_empleado}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            size="sm"
                                            className="btn-accion-tabla btn-accion-tabla--editar"
                                            onClick={() => abrirModalEdicion(empleado)}
                                            aria-label="Editar"
                                        >
                                            <i className="bi bi-pencil"></i>
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

export default TablaEmpleados;
