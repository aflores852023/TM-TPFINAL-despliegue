import React from 'react';
import './SlackMessages.css';

const SlackMessages = ({ messages }) => {
  // Ordenar mensajes por timestamp (o createdAt) en orden ascendente
  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt));

  return (
    <div className="slack-messages">
      {sortedMessages.length > 0 ? (
        sortedMessages.map((message, index) => (
          <div key={index} className="message-item">
            <img 
              src={message.imageUrl || "/img/default-avatar.png"} 
              alt="Avatar" 
              className="message-avatar" 
            />
            <div className="message-content">
              <p className="message-text">{message.text || "Mensaje vacío"}</p>
              <div className="message-info">
                <span className="message-timestamp">
                  {new Date(message.timestamp || message.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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