import React from 'react';
import { Link } from 'react-router-dom'; // Importa el componente Link

/**
 * Un componente de React que muestra un elemento de un espacio de trabajo de Slack.
 *
 * @param {object} workspace - Un objeto que contiene el `_id` y el `name` del espacio de trabajo.
 * @return {JSX.Element} Un elemento JSX que representa un espacio de trabajo.
 */
const SlackWorkspaces = ({ workspace }) => {
  const { _id, name } = workspace; // Extrae `_id` y `name` del espacio de trabajo

  return (
    <div className="workspaces-list">
      <div className="workspace-item">
        {/* Icono del workspace */}
        <div className="workspace-icon">
          <img src="/img/logo_workspaces.jpeg" width={40} height={40} alt="Workspace Icon" />
        </div>

        {/* Información del workspace */}
        <div className="workspace-info">
          <div className="workspace-name">
            {name}
            {/* Enlace para abrir el espacio de trabajo */}
            <Link to={`/Workspaces/${_id}`}>
              <button className="workspace-button">Open</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlackWorkspaces;