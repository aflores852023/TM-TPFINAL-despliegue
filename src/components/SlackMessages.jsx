// src/components/SlackMessages.jsx
import React from 'react';
import './SlackMessages.css';

const SlackMessages = ({ messages }) => {
  return (
    <div className="slack-messages">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="message-item">
            <img src="/path/to/avatar.png" alt="Avatar" className="message-avatar" />
            <div className="message-content">
              <p className="message-text">{message.text}</p>
              <div className="message-info">
                <span className="message-timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-messages">No hay mensajes aún.</div>
      )}
    </div>
  );
};

export default SlackMessages;
