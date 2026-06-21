import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import VistaAnimada from "../components/landing/VistaAnimada";

function Pagina404() {
  return (
    <VistaAnimada
      className="pagina-error"
      panel={false}
      badge="404"
      titulo="Página no encontrada"
      subtitulo="La ruta que buscas no existe o fue movida"
      icono="bi-compass"
      acciones={
        <Button as={Link} to="/" variant="primary">
          <i className="bi bi-house me-2"></i>
          Volver al inicio
        </Button>
      }
    />
  );
}

export default Pagina404;
