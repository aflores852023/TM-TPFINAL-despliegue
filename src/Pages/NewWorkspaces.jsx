import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST, getAuthenticatedHeaders } from '../fetching/http.fetching';
import ENVIROMENT from '../../enviroment.js';

const NewWorkspaces = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userInfo = JSON.parse(sessionStorage.getItem('user_info')); // Obtener la info del usuario logueado
        const userId = userInfo ? userInfo.id : null; // Obtener el ID del usuario

        
      if (!userId) {
          setError('User is not logged in!');
          return;
      }

      const newWorkspace = {
          name: workspaceName,
          imageUrl: '../img/logo_workspaces.jpeg', // Ícono predeterminado
          members: [userId],  // Agregar el ID del usuario logueado a los miembros
      };

      console.log('Payload enviado:', newWorkspace);
        const response = await POST(`${ENVIROMENT.URL_BACKEND}/api/workspaces`, {
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(newWorkspace),
        });
        console.log('Respuesta del backend:', response);
        console.log('Estado del formulario:', newWorkspace);
        console.log ('URL del backend:', `${ENVIROMENT.URL_BACKEND}/api/workspaces`);
        
        if (response.ok) {
            navigate('/');
        } else {
            setError(response.message || 'Failed to create workspace.');
        }
    } catch (err) {
        setError(err.message || 'An error occurred while creating the workspace.');
    } finally {
        setLoading(false);
        setWorkspaceName('');
    }
};

  const handleBackClick = () => {
    navigate('/Home');
  };

  return (
    <div className="home"> {/* Usar la clase home para mantener el diseño centrado */}
      <div className="home-logo">
        <img src="/img/logo_workspaces.jpeg" alt="Workspace Icon" className="slack-logo" />
      </div>
      <h2 className="home-welcome">Create New Workspace</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="create-workspace-form">
          <div className="form-group">
            <label htmlFor="workspaceName" className="form-label">Workspace Name:</label>
            <input
              type="text"
              id="workspaceName"
              className="form-input"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="create-workspace-button_in_worskpace">
              Create Workspace
            </button>
          </div>
        </form>
      )}
      <button className="create-workspace-button_back_button" onClick={handleBackClick}>
        Back to Workspaces List
      </button>
    </div>
  );
};

export default NewWorkspaces;
