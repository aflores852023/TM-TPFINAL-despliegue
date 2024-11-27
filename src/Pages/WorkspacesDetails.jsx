import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GET, POST } from '../fetching/http.fetching'; // Métodos para realizar solicitudes al backend
import SlackChannels from '../components/SlackChannels';
import SlackMessages from '../components/SlackMessages';
import SlackChat from '../components/SlackChat';
import './style.css';
import ENVIROMENT from '../../enviroment.js';
import { getAuthenticatedHeaders } from '../fetching/http.fetching';

const WorkspacesDetails = () => {
  const { workspace_id } = useParams(); // Obtener el ID del espacio de trabajo de la URL
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]); // Estado para canales
  const [selectedChannelId, setSelectedChannelId] = useState(null); // Estado para el canal seleccionado
  const [messages, setMessages] = useState([]); // Estado para mensajes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de errores
  const [menuOpen, setMenuOpen] = useState(false); // Estado del menú

  // Obtener los canales del backend
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await GET(`${ENVIROMENT.URL_BACKEND}/api/workspaces/${workspace_id}/channels`, {
          headers: getAuthenticatedHeaders(),
        });
        
        if (response.ok) {  // Verifica si la respuesta es correcta
          const responseData = response.data;
          setChannels(responseData);
          console.log('la cantidad es:', response.data.length);  // Verifica la longitud de los datos
          if (response.data.length > 0) {
            setSelectedChannelId(response.data[0]._id); // Selecciona el primer canal automáticamente
          }
        } else {
          console.log('el estado del response es,', response.status);
          console.log(response.data.length)
          throw new Error(response.message || 'Error al obtener los canales.');
          }
      } catch (err) {
        setError(err.message || 'Error al obtener los canales del backend.');
      } finally {
        setLoading(false);
      }
    };
  

    fetchChannels();
  }, [workspace_id]);

  // Obtener los mensajes de un canal seleccionado
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannelId) return;

      try {
        setLoading(true);
        const response = await GET(`${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannelId}/messages`, {
          headers: getAuthenticatedHeaders(),
        });

        if (response.ok) {
          setMessages(response.data);
        } else {
          throw new Error(response.message || 'Error al obtener los mensajes.');
        }
      } catch (err) {
        setError(err.message || 'Error al obtener los mensajes del backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChannelId]);

  // Manejar el envío de mensajes
  const handleSendMessage = async (newMessage) => {
    try {
      const response = await POST(`${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannelId}/messages`, newMessage, {
        headers: getAuthenticatedHeaders(),
      });

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, response.data]);
      } else {
        throw new Error(response.message || 'Error al enviar el mensaje.');
      }
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje al backend.');
    }
  };

  // Seleccionar un canal
  const handleChannelSelect = (channelId) => {
    setSelectedChannelId(channelId);
    setMenuOpen(false); // Cerrar menú al seleccionar canal
  };

  // Añadir un nuevo canal
  const handleAddChannel = (newChannel) => {
    setChannels((prevChannels) => [...prevChannels, newChannel]);
    setSelectedChannelId(newChannel.id);
  };

  const handleExitClick = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return <div>Loading workspace details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="workspace-details-container">
      <button className="menu-button" onClick={toggleMenu}>
        &#9776;
      </button>
      <div className={`container ${menuOpen ? 'menu-open' : ''}`}>
        <div className={`channels-container ${menuOpen ? 'open' : ''}`}>
          <SlackChannels
            channels={channels}
            workspaceId={workspace_id}
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
          {selectedChannelId && (
            <SlackChat
              onSendMessage={handleSendMessage}
              channelId={selectedChannelId}
              senderId={1} // Usa el senderId adecuado
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacesDetails;
