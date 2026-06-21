import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const NotificacionOperacion = ({
  mostrar,
  mensaje,
  tipo,
  onCerrar
}) => {

  const [visible, setVisible] = useState(mostrar);

  useEffect(() => {
    setVisible(mostrar);
  }, [mostrar]);

  const fechaLocal = () => {
    const f = new Date();

    const anio = f.getFullYear();
    const mes = String(f.getMonth() + 1).padStart(2, "0");
    const dia = String(f.getDate()).padStart(2, "0");

    return `${dia}-${mes}-${anio} ${f.toTimeString().slice(0, 5)}`;
  };

  const estilos = {
    exito: {
      titulo: "Operación Exitosa",
      icono: "bi bi-check-circle-fill",
      color: "#16a34a",
      fondo: "linear-gradient(135deg, #16a34a, #22c55e)"
    },

    advertencia: {
      titulo: "Advertencia",
      icono: "bi bi-exclamation-triangle-fill",
      color: "#d97706",
      fondo: "linear-gradient(135deg, #f59e0b, #fbbf24)"
    },

    error: {
      titulo: "Error",
      icono: "bi bi-x-circle-fill",
      color: "#dc2626",
      fondo: "linear-gradient(135deg, #dc2626, #ef4444)"
    }
  };

  const actual = estilos[tipo] || estilos.exito;

  return (
    <ToastContainer
      position="top-center"
      className="p-4"
      style={{
        zIndex: 9999
      }}
    >
      <Toast
        show={visible}
        autohide
        delay={3000}
        onClose={() => {
          setVisible(false);
          onCerrar();
        }}
        className="notificacion-operacion border-0 overflow-hidden"
        style={{
          borderRadius: "22px",
          background: "#ffffff",
          boxShadow:
            "0 18px 45px rgba(15, 23, 42, 0.18)",
          backdropFilter: "blur(12px)"
        }}
      >

        {/* HEADER */}
        <div
          style={{
            background: actual.fondo,
            padding: "18px 22px",
            position: "relative"
          }}
        >

          <div className="d-flex align-items-center">

            <div
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)"
              }}
            >
              <i
                className={actual.icono}
                style={{
                  fontSize: "28px",
                  color: "#fff"
                }}
              ></i>
            </div>

            <div className="flex-grow-1">

              <div
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "18px",
                  letterSpacing: "0.3px"
                }}
              >
                {actual.titulo}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "13px",
                  marginTop: "2px"
                }}
              >
                {fechaLocal()}
              </div>

            </div>

            <button
              onClick={() => {
                setVisible(false);
                onCerrar();
              }}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                fontSize: "20px",
                cursor: "pointer",
                transition: "0.2s"
              }}
            >
              ×
            </button>

          </div>

        </div>

        {/* BODY */}
        <Toast.Body
          style={{
            padding: "22px",
            background: "#ffffff"
          }}
        >

          <div className="d-flex align-items-start">

            <div
              style={{
                width: "6px",
                minHeight: "52px",
                borderRadius: "20px",
                background: actual.color,
                marginRight: "16px"
              }}
            ></div>

            <div>

              <div
                style={{
                  color: "#0f172a",
                  fontSize: "15px",
                  fontWeight: "600",
                  lineHeight: "1.6"
                }}
              >
                {mensaje}
              </div>

            </div>

          </div>

        </Toast.Body>

      </Toast>
    </ToastContainer>
  );
};

export default NotificacionOperacion;
