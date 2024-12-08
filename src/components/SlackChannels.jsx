// src/components/SlackChannels.jsx
import React from 'react';
import './SlackChannels.css'; // Archivo CSS exclusivo para SlackChannels

/**
 * Componente que muestra una lista de canales y permite seleccionar uno.
 *
 * @param {Array} channels - Lista de canales disponibles.
 * @param {Function} onChannelSelect - Callback para seleccionar un canal.
 */
const SlackChannels = ({ channels, onChannelSelect }) => {
  return (
    <div className="slack-channels">
      <h3 className="channels-title">Channels</h3>
      <ul className="channels-items">
        {channels.map((channel) => (
          <li
            key={channel._id}
            className="channel-item"
            onClick={() => onChannelSelect(channel)}
          >
            <span className="channel-icon">#</span>
            {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SlackChannels;
