import React, { useState } from 'react';
import { getWorkspaces } from '../helpers/workspaces';
import SlackWorkspacesList from '../components/SlackWorkspacesList';
import { useGlobalContextWorkspaces } from '../Context/GlobalContext';
import { Link } from 'react-router-dom';
import './style.css'
/**
 * Un componente funcional que representa la página de inicio de la aplicación.
 * Obtiene la lista de espacios de trabajo y los renderiza junto con un botón para crear un nuevo espacio de trabajo.
 *
 * @return {JSX.Element} El elemento JSX que representa la página de inicio
 */
const Home = () => {
  const workspaces = getWorkspaces(); // Obtener la lista de espacios de trabajo
  const { workspaces: contextWorkspaces } = useGlobalContextWorkspaces(); // Obtener la lista de espacios de trabajo del contexto

  const [workspace, setWorkspace] = useState(contextWorkspaces ? contextWorkspaces[0] : workspaces[0]); // Establecer el primer espacio de trabajo como el actual

  return ( // Renderizar la página de inicio
    <div className='home'>
      <div className='home-logo'>
        <img src='/img/logo.png' className='slack-logo' />
      </div>
      <h1 className='home-welcome'>Welcome to Clone_Slack</h1>
      <h2 className='home-subtitle'>Workspaces List</h2>

      <SlackWorkspacesList workspaces={workspaces} /> 

      <Link to={'/Workspaces/New'}>
        <div className='create-workspace-container'>
          <button className='create-workspace-button'>Create Workspace</button>
        </div>
      </Link>
    </div>
  );
};

export default Home;
