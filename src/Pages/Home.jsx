import React, { useState, useEffect } from 'react';
import { GET } from '../fetching/http.fetching';
import SlackWorkspacesList from '../components/SlackWorkspacesList';
import SlackWorkspaces from '../components/SlackWorkspaces'; // Asegúrate de importar el componente
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
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
          const workspacesData = response.data;
          if (Array.isArray(workspacesData)) {
            setWorkspaces(workspacesData);
          } else {
            setError('La respuesta no contiene un array de workspaces.');
          }
        } else {
          setError(response.message || 'Failed to fetch workspaces.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching workspaces.');
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

  if (loading) {
    return <div>Loading workspaces...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
