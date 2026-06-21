import { Alert, Button, Form } from "react-bootstrap";

const FormularioLogin = ({
  usuario,
  contrasena,
  error,
  setUsuario,
  setContrasena,
  iniciarSesion,
  mostrarPassword,
  setMostrarPassword,
  recordarme,
  setRecordarme,
  cargando,
  manejarEnter,
}) => {
  const emailValido = usuario
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.trim())
    : true;

  const camposCompletos = emailValido && usuario.trim() && contrasena.trim();

  return (
    <>
      {error && (
        <Alert variant="danger" className="login-alerta py-2 mb-3" role="alert">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
        </Alert>
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (camposCompletos) {
            iniciarSesion();
          }
        }}
        noValidate
      >
        <Form.Group className="mb-3 login-grupo" controlId="usuario">
          <Form.Label>
            <i className="bi bi-envelope me-1"></i>
            Correo electronico
          </Form.Label>
          <div className="login-input-con-icono">
            <i className="bi bi-envelope login-input-icono"></i>
            <Form.Control
              type="email"
              placeholder="tu@correo.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onKeyDown={manejarEnter}
              autoComplete="username"
              required
              isInvalid={!emailValido && usuario.trim().length > 0}
              isValid={emailValido && usuario.trim().length > 0}
            />
          </div>
          {!emailValido && usuario.trim().length > 0 && (
            <Form.Text className="text-danger login-error-validacion">
              <i className="bi bi-info-circle"></i>
              Ingresa un correo valido
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3 login-grupo" controlId="contrasena">
          <Form.Label>
            <i className="bi bi-lock me-1"></i>
            Contrasena
          </Form.Label>
          <div className="login-password-field d-flex gap-2">
            <div className="login-input-con-icono flex-grow-1">
              <i className="bi bi-lock login-input-icono"></i>
              <Form.Control
                type={mostrarPassword ? "text" : "password"}
                placeholder="Tu contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                onKeyDown={manejarEnter}
                autoComplete="current-password"
                required
              />
            </div>
            {setMostrarPassword && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={mostrarPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                className="login-btn-toggle-password"
              >
                <i className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </Button>
            )}
          </div>
        </Form.Group>

        {setRecordarme && (
          <Form.Check
            type="checkbox"
            id="recordarme"
            className="login-check-recordarme mb-3"
            label={
              <span>
                <i className="bi bi-bookmark-star me-1"></i>
                Recordar correo
              </span>
            }
            checked={recordarme}
            onChange={(e) => setRecordarme(e.target.checked)}
          />
        )}

        <Button
          type="submit"
          variant="primary"
          className="login-btn-submit w-100"
          disabled={cargando || !camposCompletos}
        >
          {cargando ? (
            <>
              <span className="login-spinner me-2" aria-hidden="true"></span>
              Ingresando...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar sesion
            </>
          )}
        </Button>
      </Form>
    </>
  );
};

export default FormularioLogin;
