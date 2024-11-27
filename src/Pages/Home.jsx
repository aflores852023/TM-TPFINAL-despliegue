import React, { useState, useEffect } from 'react';
import { GET } from '../fetching/http.fetching';
import SlackWorkspaces from '../components/SlackWorkspaces'; // Importar el componente individual
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import ENVIROMENT from '../../enviroment.js';
import { getAuthenticatedHeaders } from '../fetching/http.fetching';

const Home = () => {
  const [workspaces, setWorkspaces] = useState([]); // Estado para los workspaces
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate(); // Hook para redirigir

  // useEffect para cargar los workspaces al montar el componente
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        console.log('Fetching workspaces...');
        const response = await GET(`${ENVIROMENT.URL_BACKEND}/api/workspaces`, {
          headers: getAuthenticatedHeaders(),
        });

        if (response.ok) {
          const workspacesData = response.data;

          // Validar si es un array y mapear `_id` a `id`
          if (Array.isArray(workspacesData)) {
            const formattedWorkspaces = workspacesData.map((workspace) => ({
              ...workspace,
              id: workspace._id, // Asegurar que usemos `id` en lugar de `_id`
            }));
            console.log('Workspaces fetched:', formattedWorkspaces);
            setWorkspaces(formattedWorkspaces);
          } else {
            throw new Error('La respuesta no contiene un array de workspaces.');
          }
        } else {
          throw new Error(response.message || 'Error al obtener los workspaces.');
        }
      } catch (err) {
        console.error('Error fetching workspaces:', err.message);
        setError(err.message || 'Se produjo un error al obtener los workspaces.');
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchWorkspaces();
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_info');
    navigate('/login');
  };

  // Renderizar mientras se cargan los datos
  if (loading) {
    return <div>Loading workspaces...</div>;
  }

  // Renderizar si hay un error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render principal
  return (
    <div className="home">
      <div className="home-logo">
        <img src="/img/logo.png" className="slack-logo" alt="Slack Clone Logo" />
      </div>
      <h1 className="home-welcome">Welcome to Clone_Slack - FINAL PROJECT UTN FULL STACK</h1>
      <h2 className="home-subtitle">Workspaces List</h2>

      {workspaces.length > 0 ? (
        <div className="workspaces-container">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="workspace-card">
              <SlackWorkspaces workspace={workspace} />
            </div>
          ))}
        </div>
      ) : (
        <p>No workspaces available. Create one to get started!</p>
      )}

      <Link to={'/Workspaces/New'}>
        <div className="create-workspace-container">
          <button className="create-workspace-button">Create Workspace</button>
        </div>
      </Link>

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Home;
