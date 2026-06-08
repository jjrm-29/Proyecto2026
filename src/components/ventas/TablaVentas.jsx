import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaVentas = ({ ventas, abrirEdicion }) => {
  return (
    <div className="tabla-contenedor">
      <Table hover responsive className="tabla-app mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Pago</th>
            <th className="text-end">Total</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td className="fw-semibold">#{venta.id_venta}</td>
              <td className="text-secondary">
                {new Date(venta.fecha_venta).toLocaleString("es-NI")}
              </td>
              <td className="fw-semibold">
                {venta.clientes?.nombre_cliente} {venta.clientes?.apellido_cliente}
              </td>
              <td>
                {venta.empleados?.nombre_empleado} {venta.empleados?.apellido_empleado}
              </td>
              <td>
                <span
                  className="badge rounded-pill"
                  style={{
                    background: venta.metodo_pago === "efectivo"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #06b6d4, #0ea5e9)",
                  }}
                >
                  {venta.metodo_pago}
                </span>
              </td>
              <td className="text-end fw-bold text-primary">
                C$ {parseFloat(venta.total || 0).toFixed(2)}
              </td>
              <td className="text-center">
                <Button
                  size="sm"
                  className="btn-accion-tabla btn-accion-tabla--editar"
                  onClick={() => abrirEdicion(venta)}
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
  );
};

export default TablaVentas;
