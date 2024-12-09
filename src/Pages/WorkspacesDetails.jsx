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
  const [newChannelName, setNewChannelName] = useState('');
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
          // Evitar duplicados asegurando datos únicos
          const uniqueMessages = Array.from(new Set(response.data.map((msg) => msg._id))).map(
            (id) => response.data.find((msg) => msg._id === id)
          );
          setMessages(uniqueMessages);
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
  
    try {
        const response = await POST(
            `${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannel._id}/messages`,
            {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify({
                    text: newMessage.text,
                    channelId: selectedChannel._id,
                }),
            }
        );

        // Verifica si la respuesta es válida antes de llamar a .json()
        if (!response.ok) {
            console.error('Error en la solicitud:', response.statusText);
            setError('Error al enviar el mensaje.');
            return;
        }

        const data = await response.json(); // Aquí extraes la respuesta JSON
        setMessages((prevMessages) => [...prevMessages, data]);
    } catch (err) {
        console.error('Error en la solicitud al guardar el mensaje:', err);
        setError('Error al guardar el mensaje.');
    }
};
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;

    try {
        const response = await POST(
            `${ENVIROMENT.URL_BACKEND}/api/channels`,
            {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify({ name: newChannelName, workspaceId: workspace_id }),
            }
        );

        if (response.ok) {
            const createdChannel = response.data;
            setChannels((prev) => [...prev, createdChannel]);
            setNewChannelName('');
            setSelectedChannel(createdChannel); // Seleccionar automáticamente el nuevo canal
        } else {
            console.error('Error en el servidor al crear el canal:', response);
            setError('Failed to create channel.');
        }
    } catch (err) {
        console.error('Error de conexión al backend:', err);
        setError('Error creating channel.');
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
        <aside className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
          <SlackChannels
            channels={channels}
            onChannelSelect={(channel) => setSelectedChannel(channel)}
          />
          <div className="create-channel-form">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Nuevo canal"
            />
            <button onClick={handleCreateChannel}>Crear</button>
          </div>
          <button onClick={() => navigate('/Home')}>Volver</button>
        </aside>

        {/* Contenedor principal */}
        <main className="wd-messages-container">
  {selectedChannel && (
    <>
      <SlackMessages messages={messages} />
      <SlackChat onSendMessage={handleSendMessage} />
    </>
  )}
</main>
      </div>
    </div>
  );
};

export default WorkspacesDetails;
