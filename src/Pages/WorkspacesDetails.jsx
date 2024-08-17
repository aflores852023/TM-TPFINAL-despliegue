import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannelsForWorkspace } from '../helpers/channels';
import { getMessagesForChannel, saveMessage } from '../helpers/messages';
import SlackChannels from '../components/SlackChannels';
import SlackMessages from '../components/SlackMessages';
import SlackChat from '../components/SlackChat'; 
import './style.css';

/**
 * Un componente funcional que muestra los detalles de un espacio de trabajo, incluyendo sus canales y mensajes.
 * También proporciona funcionalidad para seleccionar canales y enviar mensajes.
 *  
 * @returns {JSX.Element} Un elemento JSX que representa los detalles de un espacio de trabajo.
 */
const WorkspacesDetails = () => {
  const { workspace_id } = useParams(); // Obtener el ID del espacio de trabajo de la URL
  const navigate = useNavigate(); // Obtener una referencia a la función de navegación
  const [channels, setChannels] = useState(() => getChannelsForWorkspace(Number(workspace_id))); // Obtener los canales del almacenamiento local
  const [selectedChannelId, setSelectedChannelId] = useState(channels.length > 0 ? channels[0].id : null); // Obtener el ID del canal seleccionado
  const [messages, setMessages] = useState([]); // Obtener los mensajes del almacenamiento local
  const [menuOpen, setMenuOpen] = useState(false); // Indicar si el menú está abierto

  useEffect(() => { // Cada vez que cambia el ID del canal, actualizar los canales y los mensajes correspondientes
    if (selectedChannelId) {
      const channelMessages = getMessagesForChannel(selectedChannelId);
      setMessages(channelMessages);
    }
  }, [selectedChannelId]);
  
  /**
   *  Maneja la selección de un canal actualizando el ID del canal seleccionado y cerrando el menú.
   * 
   *  @param {number} channelId - El ID del canal a ser seleccionado
   *  @return {void} No devuelve un valor, actualiza el estado directamente
   */
  const handleChannelSelect = (channelId) => {
    setSelectedChannelId(channelId);
    setMenuOpen(false); // Cerrar el menú al seleccionar un canal
  };

    /**
     * Agrega un nuevo canal a la lista de canales y selecciona el nuevo canal.
     *
     * @param {object} newChannel - El canal a ser agregado
     * @return {void} No devuelve un valor, actualiza el estado directamente
     */
  const handleAddChannel = (newChannel) => {
    const updatedChannels = [...channels, newChannel];
    setChannels(updatedChannels);
    setSelectedChannelId(newChannel.id);
  };

    /**
     *  Maneja el envío de un nuevo mensaje guardándolo y actualizando la lista de mensajes.
     *
     *  @param {object} newMessage - El nuevo mensaje a ser enviado
     *  @return {void} No devuelve ningún valor, actualiza el estado directamente
     */
  const handleSendMessage = (newMessage) => {
    saveMessage(newMessage);
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

    /**
     * Maneja el clic en el botón de salida.
     *
     * Redirige a la página de inicio.
     *
     * @return {void} No devuelve ningún valor
     */
  const handleExitClick = () => {
    navigate('/');
  };

    /**
     * Alterna el estado de apertura del menú.
     *
     * @return {void} No devuelve ningún valor.
     */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="workspace-details-container">
      <button className="exit-button" onClick={handleExitClick}>Exit</button>
      <button className="menu-button" onClick={toggleMenu}>
        &#9776; {/* Ícono de las tres rayas * "menú hamburguesa" (☰) * */}
      </button>
      <div className={`container ${menuOpen ? 'menu-open' : ''}`}>
        <div className={`channels-container ${menuOpen ? 'open' : ''}`}>
          <SlackChannels 
            channels={channels} 
            workspaceId={Number(workspace_id)} 
            onChannelSelect={handleChannelSelect} 
            onAddChannel={handleAddChannel} 
          />
        
        </div>
        <div className="messages-container">
          {selectedChannelId && <SlackMessages messages={messages} />}
          {selectedChannelId && <SlackChat onSendMessage={handleSendMessage} channelId={selectedChannelId} senderId={1} />}
        </div>
      </div>
    </div>
  );
};

export default WorkspacesDetails;
