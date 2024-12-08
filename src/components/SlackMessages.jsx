// src/components/SlackMessages.jsx
import React from 'react';
import './SlackMessages.css'; // Archivo CSS exclusivo para SlackMessages

/**
 * Componente que muestra los mensajes de un canal.
 *
 * @param {Array} messages - Lista de mensajes del canal.
 * @param {String} channelId - ID del canal actual.
 */
const SlackMessages = ({ messages, channelId }) => {
  return (
    <div className="slack-messages">
      <h2 className="messages-title">Messages</h2>
      <div className="messages-list">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="message-item">
              <img
                src={message.imageUrl || '/img/default-avatar.png'}
                alt={`User ${message.senderId}`}
                className="message-avatar"
              />
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-info">
                  <span className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="message-status">{message.status || 'Sent'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages available for this channel.</p>
        )}
      </div>
    </div>
  );
};

export default SlackMessages;
