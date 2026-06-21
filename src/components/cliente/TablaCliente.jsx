import React from "react";
import {
  Table,
  Spinner,
  Button,
} from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const loading = !(clientes && clientes.length > 0);

  return (
    <>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary mb-0">
            Cargando clientes...
          </p>
        </div>
      ) : (
        <div className="tabla-contenedor">
          <Table responsive hover className="tabla-app mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Celular</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td className="fw-semibold">#{cliente.id_cliente}</td>
                  <td className="fw-semibold">{cliente.nombre_cliente}</td>
                  <td className="text-secondary">
                    {cliente.apellido_cliente || "—"}
                  </td>
                  <td>{cliente.celular}</td>

                  <td className="text-center">
                    <Button
                      size="sm"
                      className="btn-accion-tabla btn-accion-tabla--editar me-1"
                      onClick={() => abrirModalEdicion(cliente)}
                      aria-label="Editar"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>

                    <Button
                      size="sm"
                      className="btn-accion-tabla btn-accion-tabla--eliminar"
                      onClick={() => abrirModalEliminacion(cliente)}
                      aria-label="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
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

export default TablaClientes;
