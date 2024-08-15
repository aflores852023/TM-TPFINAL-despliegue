import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannelsForWorkspace } from '../helpers/channels';
import { getMessagesForChannel, saveMessage } from '../helpers/messages';
import SlackChannels from '../components/SlackChannels';
import SlackMessages from '../components/SlackMessages';
import SlackChat from '../components/SlackChat'; 
import './style.css';

const WorkspacesDetails = () => {
  const { workspace_id } = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState(() => getChannelsForWorkspace(Number(workspace_id)));
  const [selectedChannelId, setSelectedChannelId] = useState(channels.length > 0 ? channels[0].id : null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChannelId) {
      const channelMessages = getMessagesForChannel(selectedChannelId);
      setMessages(channelMessages);
    }
  }, [selectedChannelId]);

  const handleChannelSelect = (channelId) => {
    setSelectedChannelId(channelId);
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

  return (
    <div className="workspace-details-container">
      <button className="exit-button" onClick={handleExitClick}>Exit</button> {/* Botón de Exit */}
      <div className="container">
        <SlackChannels 
          channels={channels} 
          workspaceId={Number(workspace_id)} 
          onChannelSelect={handleChannelSelect} 
          onAddChannel={handleAddChannel} 
        />
        <div className="messages-container">
          {selectedChannelId && <SlackMessages messages={messages} />}
          {selectedChannelId && <SlackChat onSendMessage={handleSendMessage} channelId={selectedChannelId} senderId={1} />}
        </div>
      </div>
    </div>
  );
};

export default WorkspacesDetails;
