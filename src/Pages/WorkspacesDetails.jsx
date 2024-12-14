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
                const url = `${ENVIROMENT.URL_BACKEND}/api/workspaces/${workspace_id}/channels`;
                console.log('La URL para consultar los canales es:', url);
    
                const response = await GET(url, { headers: getAuthenticatedHeaders() });
    
                console.log('Respuesta completa del servidor para canales:', response);
    
                if (response.ok) {
                    const channels = response.data || [];
                    setChannels(channels);
    
                    // Seleccionar el canal 'General' o el primero de la lista
                    const defaultChannel = channels.find((c) => c.name === 'General') || channels[0];
    
                    if (defaultChannel) {
                        setSelectedChannel(defaultChannel);
                    } else {
                        console.warn('No se encontraron canales válidos.');
                        setSelectedChannel(null);
                    }
                } else {
                    throw new Error(response.message || 'Error al obtener los canales.');
                }
            } catch (err) {
                console.error('Error al intentar obtener los canales:', err.message);
                setError('Error al obtener los canales.');
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, [workspace_id]);

   useEffect(() => {
    const fetchMessages = async () => {
        if (!selectedChannel) {
            console.warn('No se ha seleccionado un canal válido.');
            return;
        }

        try {
            const url = `${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannel._id}/messages`;
            console.log('La URL para consultar los mensajes es:', url);

            const response = await GET(url, { headers: getAuthenticatedHeaders() });

            console.log('Respuesta completa del servidor para mensajes:', response);

            if (response.ok) {
                setMessages(response.data || []);
            } else {
                throw new Error(response.message || 'Error al obtener los mensajes.');
            }
        } catch (err) {
            console.error('Error al intentar obtener los mensajes:', err.message);
            setError('Error al obtener los mensajes.');
        }
    };
    fetchMessages();
}, [selectedChannel]);

    const handleSendMessage = async (newMessage) => {
        try {
            console.log('Mensaje que se enviará:', newMessage);
            console.log('Canal seleccionado:', selectedChannel);

            const url = `${ENVIROMENT.URL_BACKEND}/api/channels/${selectedChannel._id}/messages`;
            console.log('La URL para enviar el mensaje es:', url);

            const response = await POST(url, {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify({
                    text: newMessage.text,
                    channelId: selectedChannel._id,
                }),
            });

            console.log('Respuesta completa del servidor al enviar mensaje:', response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error desde el servidor al enviar mensaje:', errorData);
                setError(errorData.message || 'Error al guardar el mensaje.');
                return;
            }

            const data = await response.json();
            console.log('Mensaje guardado:', data.data);

            setMessages((prevMessages) => [...prevMessages, data.data]);
        } catch (err) {
            console.error('Error al enviar el mensaje:', err.message);
            setError('Error al guardar el mensaje.');
        }
    };

    const handleCreateChannel = async () => {
        if (!newChannelName.trim()) return;

        try {
            const url = `${ENVIROMENT.URL_BACKEND}/api/channels`;
            console.log('La URL para crear el canal es:', url);

            const response = await POST(url, {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify({ name: newChannelName, workspaceId: workspace_id }),
            });

            console.log('Respuesta completa del servidor al crear canal:', response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error desde el servidor al crear canal:', errorData);
                setError(errorData.message || 'Error creando canal.');
                return;
            }

            const createdChannel = await response.json();
            console.log('Canal creado:', createdChannel);

            setChannels((prev) => [...prev, createdChannel]);
            setNewChannelName('');
            setSelectedChannel(createdChannel);
        } catch (err) {
            console.error('Error al crear el canal:', err.message);
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
