// WorkspacesDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GET, POST } from '../fetching/http.fetching';
import ENVIROMENT from '../../enviroment.js';
import './WorkspacesDetails.css';
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
    const [menuCollapsed, setMenuCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const data = await response.json();
                setMessages((prev) => [...prev, data]);
            }
        } catch (err) {
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
                const createdChannel = await response.json();
                setChannels((prev) => [...prev, createdChannel]);
                setNewChannelName('');
                setSelectedChannel(createdChannel);
            }
        } catch (err) {
            setError('Error creando canal.');
        }
    };

    if (loading) return <div className="wd-loading">Cargando...</div>;
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
                <aside
                    className={`wd-channels-container ${menuCollapsed ? 'collapsed' : ''}`}
                >
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
                    <button
                        className="wd-back-button"
                        onClick={() => navigate('/Home')}
                    >
                        Volver
                    </button>
                </aside>
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
