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
    "#06b6d4",
    "#16a34a",
    "#f59e0b",
    "#ec4899"
  ];

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner
          animation="border"
          variant="primary"
          size="lg"
        />

        <p className="mt-3">
          Cargando estadísticas...
        </p>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f7ff 0%, #eef4ff 35%, #e8f1ff 100%)",
        padding: "20px",
        borderRadius: "20px"
      }}
    >
      {/* HEADER */}
      <div
        className="mb-4 p-4"
        style={{
          borderRadius: "22px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          boxShadow: "0 10px 35px rgba(37, 99, 235, 0.25)"
        }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <h2
              style={{
                color: "#fff",
                fontWeight: "700",
                marginBottom: "5px"
              }}
            >
              <i className="bi bi-bar-chart-line-fill me-2"></i>
              Dashboard
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                marginBottom: 0
              }}
            >
              Estadísticas generales del negocio
            </p>
          </Col>

          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Button
              onClick={descargarExcel}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "10px 18px",
                fontWeight: "600",
                background:
                  "linear-gradient(135deg, #16a34a, #22c55e)"
              }}
            >
              <i className="bi bi-file-earmark-excel me-2"></i>
              Descargar Excel
            </Button>
          </Col>
        </Row>
      </div>

      {/* FILTROS */}
      <Card
        className="border-0 shadow-sm mb-4"
        style={{
          borderRadius: "20px",
          background: "#ffffff"
        }}
      >
        <Card.Body className="p-4">
          <Row className="g-4 align-items-end">

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={{
                    fontWeight: "600",
                    color: "#334155"
                  }}
                >
                  Fecha Desde
                </Form.Label>

                <Form.Control
                  type="date"
                  value={fechaDesde}
                  onChange={(e) =>
                    setFechaDesde(e.target.value)
                  }
                  style={{
                    borderRadius: "12px",
                    padding: "12px",
                    border: "1px solid #dbeafe"
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label
                  style={{
                    fontWeight: "600",
                    color: "#334155"
                  }}
                >
                  Fecha Hasta
                </Form.Label>

                <Form.Control
                  type="date"
                  value={fechaHasta}
                  onChange={(e) =>
                    setFechaHasta(e.target.value)
                  }
                  style={{
                    borderRadius: "12px",
                    padding: "12px",
                    border: "1px solid #dbeafe"
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Card
                className="border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  borderRadius: "15px"
                }}
              >
                <Card.Body>
                  <h6
                    style={{
                      color: "#1e40af",
                      fontWeight: "700"
                    }}
                  >
                    Total de Ventas
                  </h6>

                  <h3
                    style={{
                      marginBottom: 0,
                      fontWeight: "700",
                      color: "#0f172a"
                    }}
                  >
                    {estadisticas.cantidadVentas}
                  </h3>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* TARJETAS */}
      <Row className="g-4 mb-4">

        <Col md={6} xl={3}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #16a34a, #22c55e)",
              boxShadow: "0 10px 25px rgba(34,197,94,0.25)"
            }}
          >
            <Card.Body className="p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    style={{
                      opacity: 0.8,
                      marginBottom: "8px"
                    }}
                  >
                    Ventas Totales
                  </p>

                  <h2 style={{ fontWeight: "700" }}>
                    C$ {estadisticas.totalVentas.toFixed(2)}
                  </h2>
                </div>

                <i
                  className="bi bi-currency-dollar"
                  style={{
                    fontSize: "45px",
                    opacity: 0.3
                  }}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 10px 25px rgba(59,130,246,0.25)"
            }}
          >
            <Card.Body className="p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    style={{
                      opacity: 0.8,
                      marginBottom: "8px"
                    }}
                  >
                    Pago en Efectivo
                  </p>

                  <h2 style={{ fontWeight: "700" }}>
                    C$ {estadisticas.ventasEfectivo.toFixed(2)}
                  </h2>
                </div>

                <i
                  className="bi bi-cash-stack"
                  style={{
                    fontSize: "45px",
                    opacity: 0.3
                  }}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #7c3aed, #8b5cf6)",
              boxShadow: "0 10px 25px rgba(139,92,246,0.25)"
            }}
          >
            <Card.Body className="p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    style={{
                      opacity: 0.8,
                      marginBottom: "8px"
                    }}
                  >
                    Pago con Tarjeta
                  </p>

                  <h2 style={{ fontWeight: "700" }}>
                    C$ {estadisticas.ventasTarjeta.toFixed(2)}
                  </h2>
                </div>

                <i
                  className="bi bi-credit-card-2-front"
                  style={{
                    fontSize: "45px",
                    opacity: 0.3
                  }}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #f59e0b, #fbbf24)",
              boxShadow: "0 10px 25px rgba(245,158,11,0.25)"
            }}
          >
            <Card.Body className="p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    style={{
                      opacity: 0.8,
                      marginBottom: "8px"
                    }}
                  >
                    Productos Vendidos
                  </p>

                  <h2 style={{ fontWeight: "700" }}>
                    {estadisticas.productosVendidos}
                  </h2>
                </div>

                <i
                  className="bi bi-box-seam"
                  style={{
                    fontSize: "45px",
                    opacity: 0.3
                  }}
                ></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* GRÁFICOS */}
      <Row className="g-4">

        <Col lg={8}>
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              borderRadius: "22px"
            }}
          >
            <Card.Body className="p-4">

              <div className="mb-4">
                <h5
                  style={{
                    fontWeight: "700",
                    color: "#0f172a"
                  }}
                >
                  Ventas por Hora
                </h5>

                <p
                  style={{
                    color: "#64748b",
                    marginBottom: 0
                  }}
                >
                  Comportamiento de ventas durante el día
                </p>
              </div>

              <ResponsiveContainer
                width="100%"
                height={360}
              >
                <LineChart
                  data={estadisticas.ventasPorHora}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="hora"
                    stroke="#64748b"
                  />

                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(v) => `C$${v}`}
                  />

                  <Tooltip
                    formatter={(v) => [
                      `C$ ${v}`,
                      "Monto"
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{
                      r: 5,
                      strokeWidth: 3
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>

            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card
            className="border-0 shadow-sm h-100"
            style={{
              borderRadius: "22px"
            }}
          >
            <Card.Body className="p-4">

              <div className="mb-4">
                <h5
                  style={{
                    fontWeight: "700",
                    color: "#0f172a"
                  }}
                >
                  Ventas por Categoría
                </h5>

                <p
                  style={{
                    color: "#64748b",
                    marginBottom: 0
                  }}
                >
                  Distribución por categorías
                </p>
              </div>

              <ResponsiveContainer
                width="100%"
                height={360}
              >
                <PieChart>

                  <Pie
                    data={
                      estadisticas.ventasPorCategoria
                        .length > 0
                        ? estadisticas.ventasPorCategoria
                        : [{ name: "Sin datos", value: 1 }]
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    label
                  >
                    {estadisticas.ventasPorCategoria.map(
                      (_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            COLORES[
                            i % COLORES.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(v) => `C$ ${v}`}
                  />

                </PieChart>
              </ResponsiveContainer>

            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default Inicio;