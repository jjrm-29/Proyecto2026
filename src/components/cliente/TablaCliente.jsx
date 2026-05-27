import React, { useState, useEffect } from "react";
import {
  Table,
  Spinner,
  Button,
  Card
} from "react-bootstrap";

import "bootstrap-icons/font/bootstrap-icons.css";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!(clientes && clientes.length > 0));
  }, [clientes]);

  return (
    <Card
      className="border-0 shadow-sm rounded-4"
      style={{
        backgroundColor: "#ffffff",
      }}
    >

      <Card.Body className="p-0">

        {loading ? (

          <div className="text-center py-5">

            <Spinner
              animation="border"
              variant="dark"
            />

            <p className="mt-3 text-secondary mb-0">
              Cargando clientes...
            </p>

          </div>

        ) : (

          <Table
            responsive
            hover
            className="align-middle mb-0"
          >

            <thead
              style={{
                backgroundColor: "#111827",
                color: "#fff",
              }}
            >
              <tr>
                <th className="py-3 px-4 border-0">
                  ID
                </th>

                <th className="py-3 border-0">
                  Nombre
                </th>

                <th className="py-3 border-0">
                  Apellido
                </th>

                <th className="py-3 border-0">
                  Celular
                </th>

                <th className="py-3 border-0 text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>

              {clientes.map((cliente, index) => (

                <tr
                  key={cliente.id_cliente}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "#ffffff"
                        : "#f9fafb",
                    transition: "0.2s ease",
                  }}
                >

                  <td className="px-4 fw-semibold text-dark">
                    #{cliente.id_cliente}
                  </td>

                  <td className="fw-semibold text-dark">
                    {cliente.nombre_cliente}
                  </td>

                  <td className="text-secondary">
                    {cliente.apellido_cliente || "—"}
                  </td>

                  <td className="text-dark">
                    {cliente.celular}
                  </td>

                  <td className="text-center">

                    <Button
                      variant="light"
                      size="sm"
                      className="me-2 border rounded-3"
                      style={{
                        width: "38px",
                        height: "38px",
                      }}
                      onClick={() =>
                        abrirModalEdicion(cliente)
                      }
                    >
                      <i className="bi bi-pencil-square text-warning"></i>
                    </Button>

                    <Button
                      variant="light"
                      size="sm"
                      className="border rounded-3"
                      style={{
                        width: "38px",
                        height: "38px",
                      }}
                      onClick={() =>
                        abrirModalEliminacion(cliente)
                      }
                    >
                      <i className="bi bi-trash3 text-danger"></i>
                    </Button>

                  </td>

                </tr>

              ))}

            </tbody>

          </Table>

        )}

      </Card.Body>

    </Card>
  );
};

export default TablaClientes;