import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannelsForWorkspace } from '../helpers/channels';
import { getMessagesForChannel, saveMessage } from '../helpers/messages';
import SlackChannels from '../components/SlackChannels';
import SlackMessages from '../components/SlackMessages';
import SlackChat from '../components/SlackChat'; 
import './style.css';

const WorkspacesDetails = () => {
  const { workspace_id } = useParams(); // Obtener el ID del espacio de trabajo de la URL
  const navigate = useNavigate(); // Obtener una referencia a la función de navegación
  const [channels, setChannels] = useState(() => getChannelsForWorkspace(Number(workspace_id))); // Obtener los canales del almacenamiento local
  const [selectedChannelId, setSelectedChannelId] = useState(channels.length > 0 ? channels[0].id : null); // Obtener el ID del canal seleccionado
  const [messages, setMessages] = useState([]); // Obtener los mensajes del almacenamiento local
  const [menuOpen, setMenuOpen] = useState(false); // Indicar si el menú está abierto

  useEffect(() => { 
    if (selectedChannelId) {
      const channelMessages = getMessagesForChannel(selectedChannelId);
      setMessages(channelMessages);
    }
  }, [selectedChannelId]);

  const handleChannelSelect = (channelId) => {
    setSelectedChannelId(channelId);
    setMenuOpen(false); // Cerrar el menú al seleccionar un canal
  };

  const handleAddChannel = (newChannel) => {
    const updatedChannels = [...channels, newChannel];
    setChannels(updatedChannels);
    setSelectedChannelId(newChannel.id);
  };

  const handleSendMessage = (newMessage) => {
    saveMessage(newMessage);
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleExitClick = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="workspace-details-container">
      <button className="menu-button" onClick={toggleMenu}>
        &#9776;
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
          <div className="messages-header">
            <h2>Messages to channel</h2>
            <button className="exit-button" onClick={handleExitClick}>Exit</button>
          </div>
          {selectedChannelId && <SlackMessages messages={messages} channelId={selectedChannelId} />}
          {selectedChannelId && <SlackChat onSendMessage={handleSendMessage} channelId={selectedChannelId} senderId={1} />}
        </div>
      </div>
    </div>
  );
};

export default WorkspacesDetails;
