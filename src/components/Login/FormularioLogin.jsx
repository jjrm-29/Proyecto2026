import React from "react";
import { Form, Button, Alert } from "react-bootstrap";

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
  return (
    <>
      {error && (
        <Alert variant="danger" className="py-2 mb-3">
          {error}
        </Alert>
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          iniciarSesion();
        }}
      >
        <Form.Group className="mb-3" controlId="usuario">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="tu@correo.com"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyDown={manejarEnter}
            autoComplete="username"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="contrasena">
          <Form.Label>Contraseña</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type={mostrarPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onKeyDown={manejarEnter}
              autoComplete="current-password"
              required
            />
            {setMostrarPassword && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={
                  mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <i
                  className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </Button>
            )}
          </div>
        </Form.Group>

        {setRecordarme && (
          <Form.Check
            type="checkbox"
            id="recordarme"
            className="mb-3"
            label="Recordar correo"
            checked={recordarme}
            onChange={(e) => setRecordarme(e.target.checked)}
          />
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={cargando}
        >
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </Form>
    </>
  );
};

export default FormularioLogin;
