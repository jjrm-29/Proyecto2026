import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Button
} from "react-bootstrap";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { supabase } from "../database/supabaseconfig";
import * as XLSX from "xlsx";

const Inicio = () => {

  const [cargando, setCargando] = useState(true);

  const [fechaDesde, setFechaDesde] = useState(
    new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Managua"
    })
  );

  const [fechaHasta, setFechaHasta] = useState(
    new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Managua"
    })
  );

  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ventasEfectivo: 0,
    ventasTarjeta: 0,
    productosVendidos: 0,
    montoProductos: 0,
    cantidadVentas: 0,
    ventasPorHora: [],
    ventasPorCategoria: []
  });

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);

      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;

      const { data: ventas, error } = await supabase
        .from("ventas")
        .select("id_venta, total, fecha_venta, metodo_pago")
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango);

      if (error) throw error;

      const idsVentas = ventas?.map((v) => v.id_venta) || [];

      let productosVendidos = 0;
      let montoProductos = 0;
      let ventasPorCategoria = [];

      if (idsVentas.length > 0) {
        const { data: detalles } = await supabase
          .from("detalles_ventas")
          .select(`
            cantidad,
            subtotal,
            productos (
              nombre_producto,
              categorias (nombre_categoria)
            )
          `)
          .in("id_venta", idsVentas);

        detalles?.forEach((d) => {
          productosVendidos += d.cantidad || 0;
          montoProductos += d.subtotal || 0;

          const categoria =
            d.productos?.categorias?.nombre_categoria ||
            "Sin categoría";

          const existente = ventasPorCategoria.find(
            (c) => c.name === categoria
          );

          if (existente) {
            existente.value += d.subtotal || 0;
          } else {
            ventasPorCategoria.push({
              name: categoria,
              value: d.subtotal || 0
            });
          }
        });

        ventasPorCategoria.sort((a, b) => b.value - a.value);
      }

      const totalVentas =
        ventas?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;

      const ventasEfectivo =
        ventas
          ?.filter((v) => v.metodo_pago === "efectivo")
          .reduce((sum, v) => sum + (v.total || 0), 0) || 0;

      const ventasTarjeta =
        ventas
          ?.filter((v) => v.metodo_pago === "tarjeta")
          .reduce((sum, v) => sum + (v.total || 0), 0) || 0;

      const horaMap = Array(24).fill(0);

      ventas?.forEach((venta) => {
        if (!venta.fecha_venta) return;

        const hora = new Date(venta.fecha_venta).getHours();

        if (hora >= 0 && hora < 24) {
          horaMap[hora] += venta.total || 0;
        }
      });

      const ventasPorHora = [];
      let acumulado = 0;

      for (let h = 8; h <= 22; h++) {
        acumulado += horaMap[h];

        ventasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(acumulado)
        });
      }

      setEstadisticas({
        totalVentas,
        ventasEfectivo,
        ventasTarjeta,
        productosVendidos,
        montoProductos,
        cantidadVentas: ventas?.length || 0,
        ventasPorHora,
        ventasPorCategoria
      });

    } catch (err) {
      console.error("Error al cargar estadísticas:", err);

    } finally {
      setCargando(false);
    }
  };

  const descargarExcel = async () => {
    try {
      setCargando(true);

      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      const { data: ventas, error: errorVentas } = await supabase
        .from("ventas")
        .select(`
          id_venta,
          fecha_venta,
          total,
          metodo_pago,
          id_empleado,
          id_cliente
        `)
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango)
        .order("fecha_venta", { ascending: false });

      if (errorVentas) throw errorVentas;

      const idsVentas = ventas?.map((v) => v.id_venta) || [];

      let detallesVenta = [];

      if (idsVentas.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalles_ventas")
          .select(`
            id_detalle,
            id_venta,
            cantidad,
            precio_unitario,
            subtotal,
            id_producto,
            productos (
              nombre_producto,
              categorias (nombre_categoria)
            )
          `)
          .in("id_venta", idsVentas)
          .order("id_venta");

        if (errorDetalles) {
          console.error("Error en detalles:", errorDetalles);
        } else {
          detallesVenta = detalles || [];
        }
      }

      const wb = XLSX.utils.book_new();

      if (ventas && ventas.length > 0) {
        const wsVentas = XLSX.utils.json_to_sheet(ventas);

        XLSX.utils.book_append_sheet(
          wb,
          wsVentas,
          "Ventas"
        );

      } else {
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.json_to_sheet([
            { Mensaje: "No hay ventas en este rango" }
          ]),
          "Ventas"
        );
      }

      if (detallesVenta && detallesVenta.length > 0) {
        const wsDetalles =
          XLSX.utils.json_to_sheet(detallesVenta);

        XLSX.utils.book_append_sheet(
          wb,
          wsDetalles,
          "Detalles_Ventas"
        );

      } else {
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.json_to_sheet([
            { Mensaje: "No hay detalles de ventas" }
          ]),
          "Detalles_Ventas"
        );
      }

      XLSX.writeFile(
        wb,
        `Reporte_Ventas_${fechaDesde}_a_${fechaHasta}.xlsx`
      );

    } catch (err) {
      console.error("Error generando Excel:", err);
      alert("Error al generar el Excel. Revisa la consola.");

    } finally {
      setCargando(false);
    }
  };

  const COLORES = [
    "#2563eb",
    "#7c3aed",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#ef4444",
  ];

  if (cargando) {
    return (
      <Container className="text-center mt-5 vista-contenedor">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3 text-muted">Cargando estadísticas...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="pagina-inicio vista-contenedor px-0">
      <header className="inicio-hero">
        <Row className="align-items-center">
          <Col md={8}>
            <h2 className="inicio-hero__titulo">
              <i className="bi bi-bar-chart-line me-2 text-primary"></i>
              Resumen del negocio
            </h2>
            <p className="inicio-hero__subtitulo">
              Estadísticas según el rango de fechas seleccionado
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Button variant="success" onClick={descargarExcel}>
              <i className="bi bi-file-earmark-excel me-2"></i>
              Descargar Excel
            </Button>
          </Col>
        </Row>
      </header>

      <Card className="tarjeta-panel mb-0">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Fecha desde</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Fecha hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <div className="resumen-destacado h-100">
                <p className="resumen-destacado__etiqueta">Ventas en el periodo</p>
                <p className="resumen-destacado__valor">
                  {estadisticas.cantidadVentas}
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col md={6} xl={3}>
          <div className="tarjeta-metrica tarjeta-metrica--exito">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="tarjeta-metrica__etiqueta">Ventas totales</p>
                <p className="tarjeta-metrica__valor">
                  C$ {estadisticas.totalVentas.toFixed(2)}
                </p>
              </div>
              <i className="bi bi-currency-dollar tarjeta-metrica__icono"></i>
            </div>
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div className="tarjeta-metrica tarjeta-metrica--primario">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="tarjeta-metrica__etiqueta">Pago en efectivo</p>
                <p className="tarjeta-metrica__valor">
                  C$ {estadisticas.ventasEfectivo.toFixed(2)}
                </p>
              </div>
              <i className="bi bi-cash-stack tarjeta-metrica__icono"></i>
            </div>
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div className="tarjeta-metrica tarjeta-metrica--info">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="tarjeta-metrica__etiqueta">Pago con tarjeta</p>
                <p className="tarjeta-metrica__valor">
                  C$ {estadisticas.ventasTarjeta.toFixed(2)}
                </p>
              </div>
              <i className="bi bi-credit-card tarjeta-metrica__icono"></i>
            </div>
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div className="tarjeta-metrica tarjeta-metrica--advertencia">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="tarjeta-metrica__etiqueta">Productos vendidos</p>
                <p className="tarjeta-metrica__valor">
                  {estadisticas.productosVendidos}
                </p>
              </div>
              <i className="bi bi-box-seam tarjeta-metrica__icono"></i>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={8}>
          <Card className="tarjeta-panel h-100">
            <Card.Body>
              <div className="mb-3">
                <h5 className="tarjeta-panel__titulo">Ventas por hora</h5>
                <p className="tarjeta-panel__subtitulo">
                  Comportamiento de ventas durante el día
                </p>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={estadisticas.ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hora" stroke="#64748b" fontSize={12} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => `C$${v}`}
                  />
                  <Tooltip formatter={(v) => [`C$ ${v}`, "Monto"]} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="tarjeta-panel h-100">
            <Card.Body>
              <div className="mb-3">
                <h5 className="tarjeta-panel__titulo">Ventas por categoría</h5>
                <p className="tarjeta-panel__subtitulo">
                  Distribución por categorías
                </p>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={
                      estadisticas.ventasPorCategoria.length > 0
                        ? estadisticas.ventasPorCategoria
                        : [{ name: "Sin datos", value: 1 }]
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    label
                  >
                    {estadisticas.ventasPorCategoria.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `C$ ${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;