import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST, getAuthenticatedHeaders } from '../fetching/http.fetching';
import ENVIROMENT from '../../enviroment.js';
import './NewWorkspaces.css';

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
      const userInfo = JSON.parse(sessionStorage.getItem('user_info'));
      const userId = userInfo?.id;

      if (!userId) {
        setError('User is not logged in!');
        setLoading(false);
        return;
      }

      if (!workspaceName.trim()) {
        setError('Workspace name is required.');
        setLoading(false);
        return;
      }

      const newWorkspace = {
        name: workspaceName.trim(),
        imageUrl: '/img/logo_workspaces.jpeg',
        members: [userId],
      };

      const response = await POST(`${ENVIROMENT.URL_BACKEND}/api/workspaces`, {
        headers: getAuthenticatedHeaders(),
        body: JSON.stringify(newWorkspace),
      });

      if (response?.workspace && response?.channel) {
        navigate('/Home');
      } else {
        setError(response?.message || 'Failed to create workspace.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the workspace.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/Home');
  };

  return (
    <div className="new-workspace-container">
      <div className="new-workspace-card">
        <img
          src="/img/logo_workspaces.jpeg"
          alt="Workspace Icon"
          className="workspace-logo"
        />
        <h1 className="new-workspace-title">Create a New Workspace</h1>
        <p className="new-workspace-description">
          Work together effectively by creating a workspace for your team!
        </p>
        {error && <p className="new-workspace-error">{error}</p>}
        {loading ? (
          <p className="new-workspace-loading">Creating workspace...</p>
        ) : (
          <form onSubmit={handleSubmit} className="new-workspace-form">
            <label htmlFor="workspaceName" className="form-label">
              Workspace Name:
            </label>
            <input
              type="text"
              id="workspaceName"
              className="form-input"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
            <button type="submit" className="form-submit-button">
              Create Workspace
            </button>
          </form>
        )}
        <button
          className="back-to-list-button"
          onClick={handleBackClick}
        >
          Back to Workspaces List
        </button>
      </div>
    </div>
  );
};

export default NewWorkspaces;
