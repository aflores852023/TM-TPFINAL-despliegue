// WorkspacesDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GET, POST } from '../fetching/http.fetching';
import ENVIROMENT from '../../enviroment.js';
import './WorkspacesDetails.css'; // Archivo CSS con prefijos únicos
import SlackChannels from '../components/SlackChannels';
import SlackMessages from '../components/SlackMessages';
import SlackChat from '../components/SlackChat';
import { getAuthenticatedHeaders } from '../fetching/http.fetching';


const WorkspacesDetails = () => {
  const { workspace_id } = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuCollapsed, setMenuCollapsed] = useState(false); // Estado para colapsar/expandir el menú

  // Fetch channels on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await GET(
          `${ENVIROMENT.URL_BACKEND}/api/workspaces/${workspace_id}/channels`,
          { headers: getAuthenticatedHeaders() }
        );
        if (response.ok) {
          const { data } = response;
          setChannels(data);
          setSelectedChannel(data.find((c) => c.name === 'General') || data[0]);
        } else {
          setError('Failed to fetch channels.');
        }
      } catch (err) {
        setError('Error fetching channels.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [workspace_id]);

  // Fetch messages when a channel is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel) return;
      try {
        const response = await GET(
          `${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannel._id}/messages`,
          { headers: getAuthenticatedHeaders() }
        );
        if (response.ok) {
          setMessages(response.data);
        } else {
          setError('Failed to fetch messages.');
        }
      } catch (err) {
        setError('Error fetching messages.');
      }
    };

    fetchMessages();
  }, [selectedChannel]);

  const handleSendMessage = async (newMessage) => {
     
    const token = sessionStorage.getItem('access_token');
    let userId = null;
    if (token) {
        const decoded = jwt_decode(token); // Decodificar el token para obtener el userId
        userId = decoded.id; //   Obtener el userId del payload del token
    }

    if (!userId) {
        console.error('No se pudo obtener el userId del token.');
        setError('Error: No se pudo identificar al usuario.');
        return;
    }

    console.log('Enviando mensaje:', newMessage);

    try {
        const response = await POST(
            `${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannel._id}/messages`,
            {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify({
                    text: newMessage.text, // Campo `text` requerido por el esquema
                    senderId: userId, // ID del usuario logueado
                    channelId: selectedChannel._id, // ID del canal seleccionado
                }),
            }
        );

        if (response.ok) {
            console.log('Respuesta del backend:', response);
            setMessages((prev) => [...prev, response.data.data]); // Agrega el nuevo mensaje
        } else {
            console.error('Error en el backend:', response);
            setError('Failed to send message.');
        }
    } catch (err) {
        console.error('Error al enviar el mensaje:', err);
        setError('Error sending message.');
    }
};

  if (loading) return <div className="wd-loading">Loading workspace details...</div>;
  if (error) return <div className="wd-error-message">{error}</div>;

  return (
    <div className="wd-workspace-details">
      <button
        className="wd-toggle-button"
        onClick={() => setMenuCollapsed(!menuCollapsed)}
      >
        ☰
      </button>
      <header className="wd-workspace-header">Workspace Details</header>
      <div className="wd-workspace-container">
        {/* Sidebar de canales */}
        <aside className={`wd-channels-container ${menuCollapsed ? 'collapsed' : ''}`}>
          <SlackChannels
            channels={channels}
            onChannelSelect={(channel) => setSelectedChannel(channel)}
          />
          <button className="wd-back-button" onClick={() => navigate('/Home')}>
            Volver
          </button>
          <button
            className="wd-create-channel-button"
            onClick={() => alert('Crear canal')}
          >
            Crear Nuevo Canal
          </button>
        </aside>

        {/* Contenedor principal */}
        <main className="wd-messages-container">
          {selectedChannel && (
            <>
              <SlackMessages messages={messages} channelId={selectedChannel._id} />
              <SlackChat
                messages={messages}
                onSendMessage={(newMessage) => handleSendMessage(newMessage)}
                channelId={selectedChannel._id}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default WorkspacesDetails;
