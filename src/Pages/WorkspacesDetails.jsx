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

      if (response.ok) {
        const sentMessage = response.data; // Ajusta según la respuesta de tu backend
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
      } else {
        console.error('Error al enviar el mensaje:', response);
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
