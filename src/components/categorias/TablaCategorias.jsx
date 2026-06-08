import React, { useEffect, useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCategoria,
  copiarCategoria
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorias && categorias.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [categorias]);

  

  return (
    <>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary mb-0">Cargando categorías...</p>
        </div>
      ) : (
        <div className="tabla-contenedor">
          <Table hover responsive className="tabla-app mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th className="d-none d-md-table-cell">Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id_categoria}>
                  <td className="fw-semibold">#{categoria.id_categoria}</td>
                  <td className="fw-semibold">{categoria.nombre_categoria}</td>
                  <td className="d-none d-md-table-cell text-secondary">
                    {categoria.descripcion_categoria}
                  </td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      className="btn-accion-tabla btn-accion-tabla--editar me-1"
                      onClick={() => abrirModalEdicion(categoria)}
                      aria-label="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    <Button
                      size="sm"
                      className="btn-accion-tabla btn-accion-tabla--eliminar me-1"
                      onClick={() => abrirModalEliminacion(categoria)}
                      aria-label="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="btn-accion-tabla"
                      onClick={() => generarPDFCategoria(categoria)}
                      aria-label="Generar PDF"
                    >
                      <i className="bi bi-file-earmark-pdf"></i>
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="btn-accion-tabla ms-1"
                      onClick={() => copiarCategoria(categoria)}
                      aria-label="Copiar"
                    >
                      <i className="bi bi-clipboard"></i>
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

export default TablaCategorias;
