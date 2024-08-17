import React from 'react';
import { Link } from 'react-router-dom'; // Importa el componente Link
/**
 * Un componente de React que muestra una lista de espacios de trabajo de Slack.
 *
 * @param {object} workspace - Un objeto que contiene el id y el nombre del espacio de trabajo.
 * @return {JSX.Element} Un elemento JSX que representa la lista de espacios de trabajo.
 */
const SlackWorkspaces = ({ workspace }) => { // Recibe un objeto que contiene el id y el nombre del espacio de trabajo
  const { id, name } = workspace // Extrae el id y el nombre del espacio de trabajo
  return (
    <div className='workspaces-list'>
      <div className='workspace-item'>  
        <div className='workspace-icon'> <img src='/img/logo_workspaces.jpeg' width={40} height={40} /></div>
        <div className= 'workspace-info'>
          <div className = 'workspace-name'>{name}
                <Link to={`/Workspaces/${id}/${id}`}> {/* // Crea un enlace para abrir el espacio de trabajo */}
                <button className='workspace-button'>Open</button>
                </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SlackWorkspaces;
