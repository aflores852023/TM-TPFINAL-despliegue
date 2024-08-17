import '../Pages/style.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addChannel, getNextChannelId } from '../helpers/channels';



/**
 * Un componente funcional que muestra una lista de canales para un espacio de trabajo determinado.
 * Permite a los usuarios crear nuevos canales y navegar hacia atrás a la lista de espacios de trabajo.
 *
 * @param {Object[]} channels - Un arreglo de objetos de canal con propiedades id y name.
 * @param {number} workspaceId - El ID del espacio de trabajo al que pertenecen los canales.
 * @param {function} onChannelSelect - Una función de callback para manejar la selección de un canal.
 * @param {function} onAddChannel - Una función de callback para manejar la adición de un nuevo canal.
 */
const SlackChannels = ({ channels, workspaceId, onChannelSelect, onAddChannel }) => {
  const [isCreatingChannel, setIsCreatingChannel] = useState(false); // Indicar si se esta creando un nuevo canal
  const [newChannelName, setNewChannelName] = useState(''); // Nombre del nuevo canal

  const navigate = useNavigate(); // Obtener una referencia a la función de navegación


    /**
     * Maneja el clic en el botón de crear canal.
     *
     * @return {void} No devuelve ningún valor.
     */
  const handleCreateChannelClick = () => {
    setIsCreatingChannel(true);
  };

    /**
     * Maneja el evento de clic en el botón de cancelar.
     *
     * Restablece el estado de creación de canales y borra el nombre del nuevo canal.
     *
     * @return {void} No devuelve ningún valor.
     */
  const handleCancelClick = () => {
    setIsCreatingChannel(false);
    setNewChannelName('');
  };


    /**
     * Maneja el evento de clic para crear un nuevo canal.
     *
     * Verifica si el nombre del canal no está vacío, crea un nuevo objeto de canal
     * con el siguiente ID disponible y agrega el canal al almacenamiento local.
     * Luego, actualiza la lista de canales en el componente padre, selecciona el
     * nuevo canal creado y resetea el formulario.
     *
     * @return {void}
     */
  const handleCreateClick = () => {
    if (newChannelName.trim() === '') {
      alert('Channel name cannot be empty');
      return;
    }

    // Obtener el siguiente ID de canal
    const newChannelId = getNextChannelId();

    const newChannel = { // Crear un nuevo objeto de canal
      id: newChannelId, // Agregar el siguiente ID de canal
      name: newChannelName, // Agregar el nombre del canal
      workspaceId: workspaceId, // Agregar workspaceId al canal
    };

    // Llamar a la función addChannel para agregar el canal al almacenamiento local
    const updatedChannels = addChannel(newChannel);

    // Actualizar la lista de canales en el componente padre
    onAddChannel(newChannel);

    // Seleccionar el nuevo canal creado
    onChannelSelect(newChannel.id);

    // Resetear el formulario
    setIsCreatingChannel(false);
    setNewChannelName('');
  };
  /**
   * Maneja el clic en el botón de retroceso.
   *
   * @return {void} No devuelve ningún valor.
   */
  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="channels-container">
      <div className="channels">
        <h2>Channels</h2>
        {channels.length > 0 ? (
          <ul>
            {channels.map(channel => (
              <li key={channel.id} onClick={() => onChannelSelect(channel.id)}>
                <div>{channel.name}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No channels available for this workspace</p>
        )}
        {!isCreatingChannel ? (
          <button className="create-channel-button" onClick={handleCreateChannelClick}>Create Channel</button>
        ) : (
          <div className="create-channel-form">
            <input
              type="text"
              placeholder="Name of channel"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />
            <button className="create-channel-button" onClick={handleCreateClick}>Create</button>
            <button className="cancel-channel-button" onClick={handleCancelClick}>Cancel</button>
          </div>
        )}
      </div>
      <button className="back-button" onClick={handleBackClick}>
        Back to Workspaces List
      </button>
    </div>
  );
};

export default SlackChannels;
