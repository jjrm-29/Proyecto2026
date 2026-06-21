import { useEffect, useState, useRef } from "react";
import { Row, Col, Card, Form, Button, Offcanvas, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import ChatIA from "../components/ia/ChatIA";
import { descargarBlob } from "../utils/descargas";


const Inicio = () => {

  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarChatIA, setMostrarChatIA] = useState(false);
  const graficoHoraRef = useRef(null);
  const navigate = useNavigate();

  const opcionesMenu = [
    { texto: "Inicio", icono: "bi-house-door", tipo: "seccion", destino: "inicio-hero" },
    { texto: "Resumen", icono: "bi-stars", tipo: "seccion", destino: "inicio-resumen" },
    { texto: "Estadisticas", icono: "bi-graph-up-arrow", tipo: "seccion", destino: "inicio-estadisticas" },
    { texto: "Reportes", icono: "bi-file-earmark-bar-graph", tipo: "seccion", destino: "inicio-reportes" },
    { texto: "Categorias", icono: "bi-tags", tipo: "ruta", destino: "/categorias" },
    { texto: "Productos", icono: "bi-box-seam", tipo: "ruta", destino: "/productos" },
    { texto: "Clientes", icono: "bi-people", tipo: "ruta", destino: "/clientes" },
    { texto: "Ventas", icono: "bi-receipt", tipo: "ruta", destino: "/ventas" },
    { texto: "Catalogo", icono: "bi-grid-3x3-gap", tipo: "ruta", destino: "/catalogo" },
    { texto: "Dashboard", icono: "bi-speedometer2", tipo: "ruta", destino: "/dashboard" },
    { texto: "Asistente IA", icono: "bi-chat-dots", tipo: "accion", destino: "ia" },
  ];

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

  useEffect(() => {
    const elementos = document.querySelectorAll(".inicio-futurista-reveal");

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("inicio-futurista-reveal--visible");
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    elementos.forEach((elemento) => observador.observe(elemento));

    return () => observador.disconnect();
  }, []);

  const generarPdfVentasHora = async () => {
  try {

    const pdf = new jsPDF("p", "mm", "a4");

    // Título y fecha
    pdf.setFontSize(18);
    pdf.setTextColor("#330775");
    pdf.setFont("helvetica", "bold");
    pdf.text("Reporte de Ventas por Hora", 14, 15);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#000000");
    pdf.setFontSize(10);
    pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);

    // Imagen del gráfico
    const canvas = await html2canvas(graficoHoraRef.current);
    const imagen = canvas.toDataURL("image/png");
    pdf.addImage(imagen, "PNG", 10, 30, 190, 80);

    // Resumen general
    pdf.setFontSize(14);
    pdf.setTextColor("#330775");
    pdf.setFont("helvetica", "bold");
    pdf.text("Resumen General", 14, 115);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#000000");
    pdf.setFontSize(10);

    pdf.text(
      `Total Ventas: C$ ${estadisticas.totalVentas.toFixed(2)}`,
      14,
      125
    );
    pdf.text(
      `Ventas Efectivo: C$ ${estadisticas.ventasEfectivo.toFixed(2)}`,
      14,
      132
    );
    pdf.text(
      `Ventas Tarjeta: C$ ${estadisticas.ventasTarjeta.toFixed(2)}`,
      14,
      139
    );
    pdf.text(
      `Productos Vendidos: ${estadisticas.productosVendidos}`,
      14,
      146
    );
    pdf.text(
      `Cantidad Ventas: ${estadisticas.cantidadVentas}`,
      14,
      153
    );

    // Tabla de ventas por hora
    const filas = estadisticas.ventasPorHora.map((item) => [
      item.hora,
      `C$ ${item.total}`
    ]);

    autoTable(pdf, {
      startY: 160,
      head: [["Hora", "Monto Acumulado"]],
      body: filas
    });

    const fechaActual = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Managua"
    });

    descargarBlob(
      pdf.output("blob"),
      `VentasHora_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`
    );

  } catch (error) {
    console.error(error);
    alert("Error generando PDF");
  }
};

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

      const datosExcel = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array"
      });

      descargarBlob(
        new Blob([datosExcel], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
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

  const irAOpcion = (opcion) => {
    setMenuAbierto(false);

    if (opcion.tipo === "accion") {
      setMostrarChatIA(true);
      return;
    }

    if (opcion.tipo === "ruta") {
      navigate(opcion.destino);
      return;
    }

    document.getElementById(opcion.destino)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="pagina-inicio pagina-inicio-futurista px-0">
      <button
        type="button"
        className="inicio-menu-futurista"
        onClick={() => setMenuAbierto(true)}
        aria-label="Abrir menu de navegacion"
        title="Abrir menu"
      >
        <i className="bi bi-list"></i>
      </button>

      <Offcanvas
        show={menuAbierto}
        onHide={() => setMenuAbierto(false)}
        placement="start"
        className="inicio-offcanvas-futurista"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span>Menu Pulperia</span>
            <small>Navegacion del negocio</small>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="inicio-menu-lista">
            {opcionesMenu.map((opcion) => (
              <Nav.Link
                key={`${opcion.tipo}-${opcion.destino}`}
                onClick={() => irAOpcion(opcion)}
              >
                <i className={`bi ${opcion.icono}`}></i>
                <span>{opcion.texto}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <ChatIA mostrar={mostrarChatIA} onCerrar={() => setMostrarChatIA(false)} />

      <section id="inicio-hero" className="inicio-futurista-hero">
        <div className="inicio-futurista-hero__contenido inicio-futurista-reveal">
          <span className="inicio-futurista-hero__badge">Pulperia inteligente</span>
          <h1>Tu pulperia organizada, animada y lista para vender.</h1>
          <p>
            Acceso rapido a caja, inventario, clientes y reportes con una escena
            de pulperia que se mantiene viva tambien en celular.
          </p>
          <div className="inicio-futurista-hero__acciones">
            <Button onClick={() => irAOpcion({ tipo: "seccion", destino: "inicio-estadisticas" })}>
              <i className="bi bi-activity me-2"></i>
              Ver estadisticas
            </Button>
            <Button variant="outline-light" onClick={() => setMenuAbierto(true)}>
              <i className="bi bi-grid me-2"></i>
              Abrir menu
            </Button>
          </div>
        </div>

        <div className="inicio-pulperia-panel inicio-futurista-reveal" aria-label="Pulperia animada">
          <div className="pulperia-animada">
            <div className="pulperia-animada__toldo">
              <span></span><span></span><span></span><span></span>
            </div>
            <div className="pulperia-animada__letrero">Pulperia</div>
            <div className="pulperia-animada__estantes">
              <span className="producto producto--botella"></span>
              <span className="producto producto--caja"></span>
              <span className="producto producto--lata"></span>
              <span className="producto producto--bolsa"></span>
              <span className="producto producto--caja producto--pequena"></span>
              <span className="producto producto--botella producto--alta"></span>
            </div>
            <div className="pulperia-animada__mostrador">
              <span className="pulperia-animada__scanner"></span>
              <span className="pulperia-animada__bolsa"></span>
            </div>
            <div className="pulperia-animada__luces" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div className="inicio-pulperia-panel__estado">
            <span></span>
            Caja lista para vender
          </div>
        </div>
      </section>

      <section id="inicio-resumen" className="inicio-futurista-seccion inicio-futurista-reveal">
        <div>
          <span className="inicio-futurista-etiqueta">Panel principal</span>
          <h2>Todo lo importante queda a un toque.</h2>
        </div>
        <div className="inicio-futurista-grid">
          <article>
            <i className="bi bi-lightning-charge"></i>
            <h3>Acceso veloz</h3>
            <p>El menu lateral concentra las rutas principales sin ocupar el encabezado.</p>
          </article>
          <article>
            <i className="bi bi-shop"></i>
            <h3>Pulperia animada</h3>
            <p>La entrada se siente conectada al negocio real: productos, caja y movimiento.</p>
          </article>
          <article>
            <i className="bi bi-bar-chart"></i>
            <h3>Datos vivos</h3>
            <p>Las metricas y graficas siguen conectadas al rango de fechas del negocio.</p>
          </article>
        </div>
      </section>

      <section id="inicio-estadisticas" className="inicio-futurista-reveal">
        <div className="inicio-futurista-encabezado">
          <div>
            <span className="inicio-futurista-etiqueta">Estadisticas</span>
            <h2>Resumen del negocio</h2>
            <p>Datos segun el rango de fechas seleccionado.</p>
          </div>
          <Button variant="success" onClick={descargarExcel} disabled={cargando}>
            <i className="bi bi-file-earmark-excel me-2"></i>
            <span className="d-none d-sm-inline">Descargar Excel</span>
            <span className="d-inline d-sm-none">Excel</span>
          </Button>
        </div>

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
      </section>

      <section id="inicio-reportes" className="inicio-futurista-reveal">
      <Row className="g-3">
        <Col lg={8}>
          <Card className="tarjeta-panel h-100">
            <Card.Body ref={graficoHoraRef}>
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
            <div className="p-3 text-center">
              <Button variant="outline-danger"
              onClick={generarPdfVentasHora}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Descargar PDF
              </Button>
            </div>
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
      </section>
    </div>
  );
};

export default Inicio;
