import React, { useState, useEffect } from 'react';
import { GET } from '../fetching/http.fetching';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Archivo CSS exclusivo para esta página
import ENVIROMENT from '../../enviroment.js';
import { getAuthenticatedHeaders } from '../fetching/http.fetching';

const Home = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await GET(`${ENVIROMENT.URL_BACKEND}/api/workspaces`, {
          headers: getAuthenticatedHeaders(),
        });

        if (response.ok) {
          const workspacesData = response.data.map((workspace) => ({
            ...workspace,
            id: workspace._id,
          }));
          setWorkspaces(workspacesData);
        } else {
          throw new Error(response.message || 'Error al obtener los workspaces.');
        }
      } catch (err) {
        setError(err.message || 'Se produjo un error al obtener los workspaces.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_info');
    navigate('/login');
  };

  if (loading) return <div className="loading-message">Loading workspaces...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      <header className="home-header">
        <img src="/img/logo.png" alt="Slack Logo" className="home-logo" />
        <h1>¡Hola otra vez!</h1>
        <p>Selecciona un espacio de trabajo para continuar</p>
      </header>

      <main className="home-main">
        <div className="workspaces-container">
          <h2 className="section-title">Espacios de trabajo</h2>
          <div className="workspaces-grid">
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <div key={workspace.id} className="workspace-card">
                  <div className="workspace-info">
                    <img
                      src="/img/logo_workspaces.jpeg"
                      alt={workspace.name}
                      className="workspace-logo"
                    />
                    <div className="workspace-details">
                      <h3 className="workspace-name">{workspace.name}</h3>
                      <p className="workspace-members">42 miembros</p>
                    </div>
                  </div>
                  <Link
                    to={`/Workspaces/${workspace.id}`}
                    className="workspace-link"
                  >
                    Entrar →
                  </Link>
                </div>
              ))
            ) : (
              <p>No hay espacios disponibles. Crea uno para comenzar.</p>
            )}
          </div>
          <Link to={'/Workspaces/New'}>
            <button className="create-workspace-button">Crear nuevo espacio</button>
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </footer>
    </div>
  );
};

export default Home;
