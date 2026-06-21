import VistaAnimada from "../components/landing/VistaAnimada";

const Dashboard = () => {
  return (
    <VistaAnimada
      titulo="Dashboard Power BI"
      subtitulo="Reportes y análisis avanzados"
      icono="bi-graph-up"
      panel={false}
    >
      <div className="dashboard-embed vista-panel" style={{ height: "min(75vh, 720px)" }}>
        <iframe
          title="estadisticas"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiMzVkY2NlNmEtMzMzMS00MTVkLTkyNjUtZWJmZjY0NTQ5ODAwIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
          allowFullScreen
        ></iframe>
      </div>
    </VistaAnimada>
  );
};

export default Dashboard;
