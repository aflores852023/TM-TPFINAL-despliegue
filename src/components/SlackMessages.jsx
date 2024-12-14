import React from 'react';
import './SlackMessages.css';

const SlackMessages = ({ messages }) => {
  // Ordenar mensajes por timestamp (o createdAt) en orden ascendente
  const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="slack-messages">
      {sortedMessages.length > 0 ? (
        sortedMessages.map((message, index) => (
          <div
            key={index}
            className={`message-item ${
              message.senderId === 'welcome' ? 'message-left' : 'message-right'
            }`}
          >
            <img
              src={message.imageUrl || '/img/picture1.jpg'}
              alt="Avatar"
              className="message-avatar"
            />
            <div className="message-content">
              <p className="message-text">{message.text}</p>
              <div className="message-info">
                <span className="message-timestamp">
                  {new Date(message.timestamp || message.createdAt).toLocaleTimeString()}
                </span>
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
