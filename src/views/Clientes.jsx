import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import TarjetaCliente from "../components/cliente/TarjetaCliente";
import ModalRegistroCliente from "../components/cliente/ModalRegistroCliente";
import ModalEliminacionCliente from "../components/cliente/ModalEliminacionCliente";
import ModalEdicionCliente from "../components/cliente/ModalEdicionCliente";
import TablaClientes from "../components/cliente/TablaCliente";

import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: ""
  });

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [nuevoCliente, setNuevoCliente] =
    useState({
      nombre_cliente: "",
      apellido_cliente: "",
      celular: "",
    });

  const [clientes, setClientes] =
    useState([]);

  const [
    clientesFiltrados,
    setClientesFiltrados
  ] = useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [
    mostrarModalEliminacion,
    setMostrarModalEliminacion
  ] = useState(false);

  const [
    clienteAEliminar,
    setClienteAEliminar
  ] = useState(null);

  const [
    mostrarModalEdicion,
    setMostrarModalEdicion
  ] = useState(false);

  const [
    textoBusqueda,
    setTextoBusqueda
  ] = useState("");

  const [
    registrosPorPagina,
    establecerRegistrosPorPagina
  ] = useState(5);

  const [
    paginaActual,
    establecerPaginaActual
  ] = useState(1);

  const [clienteEditar, setClienteEditar] =
    useState({
      id_cliente: "",
      nombre_cliente: "",
      apellido_cliente: "",
      celular: "",
    });

  const clientesPaginados =
    clientesFiltrados.slice(
      (paginaActual - 1) * registrosPorPagina,
      paginaActual * registrosPorPagina
    );

  // =========================
  // BUSQUEDA
  // =========================

  const manejarBusqueda = (e) => {

    setTextoBusqueda(e.target.value);

  };

  useEffect(() => {

    if (!textoBusqueda.trim()) {

      setClientesFiltrados(clientes);

    } else {

      const textoLower =
        textoBusqueda.toLowerCase().trim();

      const filtrados = clientes.filter(
        (cli) =>
          cli.nombre_cliente
            ?.toLowerCase()
            .includes(textoLower) ||

          cli.apellido_cliente
            ?.toLowerCase()
            .includes(textoLower) ||

          cli.celular
            ?.toLowerCase()
            .includes(textoLower)
      );

      setClientesFiltrados(filtrados);

    }

  }, [textoBusqueda, clientes]);

  // =========================
  // MODALES
  // =========================

  const abrirModalEdicion = (cliente) => {

    setClienteEditar({
      id_cliente: cliente.id_cliente,
      nombre_cliente: cliente.nombre_cliente,
      apellido_cliente: cliente.apellido_cliente,
      celular: cliente.celular,
    });

    setMostrarModalEdicion(true);

  };

  const abrirModalEliminacion = (cliente) => {

    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);

  };

  // =========================
  // INPUTS
  // =========================

  const manejoCambioInput = (e) => {

    const { name, value } = e.target;

    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const manejoCambioInputEdicion = (e) => {

    const { name, value } = e.target;

    setClienteEditar((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // =========================
  // AGREGAR CLIENTE
  // =========================

  const agregarCliente = async () => {

    try {

      if (
        !nuevoCliente.nombre_cliente.trim() ||
        !nuevoCliente.celular.trim()
      ) {

        setToast({
          mostrar: true,
          mensaje:
            "Debe llenar nombre y celular.",
          tipo: "advertencia",
        });

        return;
      }

      const { error } =
        await supabase
          .from("clientes")
          .insert([
            {
              nombre_cliente:
                nuevoCliente.nombre_cliente,

              apellido_cliente:
                nuevoCliente.apellido_cliente,

              celular:
                nuevoCliente.celular,
            },
          ]);

      if (error) {

        setToast({
          mostrar: true,
          mensaje:
            "Error al registrar cliente.",
          tipo: "error",
        });

        return;
      }

      setToast({
        mostrar: true,
        mensaje:
          "Cliente registrado exitosamente.",
        tipo: "exito",
      });

      setNuevoCliente({
        nombre_cliente: "",
        apellido_cliente: "",
        celular: "",
      });

      setMostrarModal(false);

      await cargarClientes();

    } catch (err) {

      setToast({
        mostrar: true,
        mensaje:
          "Error inesperado al registrar cliente.",
        tipo: "error",
      });

    }
  };

  // =========================
  // CARGAR CLIENTES
  // =========================

  const cargarClientes = async () => {

    try {

      setCargando(true);

      const { data, error } =
        await supabase
          .from("clientes")
          .select("*")
          .order("id_cliente", {
            ascending: true,
          });

      if (error) {

        setToast({
          mostrar: true,
          mensaje:
            "Error al cargar clientes.",
          tipo: "error",
        });

        return;
      }

      setClientes(data || []);

    } catch (err) {

      setToast({
        mostrar: true,
        mensaje:
          "Error inesperado al cargar clientes.",
        tipo: "error",
      });

    } finally {

      setCargando(false);

    }
  };

  useEffect(() => {

    cargarClientes();

  }, []);

  // =========================
  // ELIMINAR
  // =========================

  const eliminarCliente = async () => {

    if (!clienteAEliminar) return;

    try {

      setMostrarModalEliminacion(false);

      const { error } =
        await supabase
          .from("clientes")
          .delete()
          .eq(
            "id_cliente",
            clienteAEliminar.id_cliente
          );

      if (error) {

        setToast({
          mostrar: true,
          mensaje:
            "Error al eliminar cliente.",
          tipo: "error",
        });

        return;
      }

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje:
          "Cliente eliminado exitosamente.",
        tipo: "exito",
      });

    } catch (err) {

      setToast({
        mostrar: true,
        mensaje:
          "Error inesperado al eliminar cliente.",
        tipo: "error",
      });

    }
  };

  // =========================
  // ACTUALIZAR
  // =========================

  const actualizarCliente = async () => {

    try {

      if (
        !clienteEditar.nombre_cliente.trim() ||
        !clienteEditar.celular.trim()
      ) {

        setToast({
          mostrar: true,
          mensaje:
            "Debe llenar nombre y celular.",
          tipo: "advertencia",
        });

        return;
      }

      setMostrarModalEdicion(false);

      const { error } =
        await supabase
          .from("clientes")
          .update({
            nombre_cliente:
              clienteEditar.nombre_cliente,

            apellido_cliente:
              clienteEditar.apellido_cliente,

            celular:
              clienteEditar.celular,
          })

          .eq(
            "id_cliente",
            clienteEditar.id_cliente
          );

      if (error) {

        setToast({
          mostrar: true,
          mensaje:
            "Error al actualizar cliente.",
          tipo: "error",
        });

        return;
      }

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje:
          "Cliente actualizado exitosamente.",
        tipo: "exito",
      });

    } catch (err) {

      setToast({
        mostrar: true,
        mensaje:
          "Error inesperado al actualizar cliente.",
        tipo: "error",
      });

    }
  };

  // =========================
  // RETURN
  // =========================

  return (
    <Container fluid className="vista-contenedor px-0">
      <div className="vista-panel">
          <header className="vista-encabezado">
            <div className="vista-encabezado__titulo-grupo">
              <div className="vista-encabezado__icono" aria-hidden="true">
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <h2>Clientes</h2>
                <p className="vista-encabezado__subtitulo">
                  Gestión y administración de clientes
                </p>
              </div>
            </div>
            <div className="vista-encabezado__acciones">
              <Button
                variant="primary"
                onClick={() => setMostrarModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Nuevo cliente
              </Button>
            </div>
          </header>

          {/* BUSQUEDA */}

          <Row className="mb-4">

            <Col lg={5} md={7}>

              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarBusqueda}
                placeholder="Buscar por nombre, apellido o celular..."
              />

            </Col>

          </Row>

          {/* ALERTA */}

          {!cargando &&
            textoBusqueda.trim() &&
            clientesFiltrados.length === 0 && (

            <Alert
              variant="light"
              className="border-0 shadow-sm rounded-4 text-center py-4"
            >

              <i className="bi bi-search text-primary fs-1"></i>

              <h5 className="mt-3 fw-semibold">

                No se encontraron clientes

              </h5>

              <p className="text-muted mb-0">

                Intenta con otro nombre o número.

              </p>

            </Alert>

          )}

          {/* LOADING */}

          {cargando && (

            <Row className="text-center py-5">

              <Col>

                <Spinner
                  animation="border"
                  variant="primary"
                  style={{
                    width: "3rem",
                    height: "3rem"
                  }}
                />

                <p className="mt-3 text-muted fw-medium">

                  Cargando clientes...

                </p>

              </Col>

            </Row>

          )}

          {/* TABLAS */}

          {!cargando &&
            clientesFiltrados.length > 0 && (

            <Row>

              <Col
                xs={12}
                className="d-lg-none"
              >

                <TarjetaCliente
                  clientes={clientesPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />

              </Col>

              <Col
                lg={12}
                className="d-none d-lg-block"
              >

                <TablaClientes
                  clientes={clientesPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />

              </Col>

            </Row>

          )}

          {/* PAGINACION */}

          {clientesFiltrados.length > 0 && (

            <div className="mt-4">

              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={clientesFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />

            </div>

          )}

      </div>

      {/* MODALES */}

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() =>
          setToast({
            ...toast,
            mostrar: false
          })
        }
      />

    </Container>
  );
};

export default Clientes;