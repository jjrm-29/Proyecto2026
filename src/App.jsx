import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Login from "./views/Login";
import RutasProtegida from "./components/rutas/RutasProtegida";
import Pagina404 from "./views/Pagina404";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Encabezado />

      <main className="margen-superior-main">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route 
            path="/" 
            element={
              <RutasProtegida>
                <Inicio />
              </RutasProtegida>
            } 
          />
          
          <Route 
            path="/Categorias" 
            element={
              <RutasProtegida>
                <Categorias />
              </RutasProtegida>
            } 
          />
          
          <Route path="/catalogo" element={<Catalogo />} />
          
          <Route 
            path="/productos" 
            element={
              <RutasProtegida>
                <Productos />
              </RutasProtegida>
            } 
          />

          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;