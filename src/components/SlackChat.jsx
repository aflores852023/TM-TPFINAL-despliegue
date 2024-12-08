 
// src/components/SlackChat.jsx
import React, { useState } from 'react';
import './SlackChat.css'; // Archivo CSS exclusivo para SlackChat

/**
 * Componente que muestra los mensajes de un canal y permite enviar nuevos mensajes.
 *
 * @param {Array} messages - Lista de mensajes del canal.
 * @param {Function} onSendMessage - Callback para enviar un mensaje.
 * @param {String} channelId - ID del canal actual.
 */
const SlackChat = ({ messages, onSendMessage, channelId }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    onSendMessage({
      channelId,
      text: newMessage,
      senderId: 'currentUserId', // Cambiar por el ID real del usuario
    });

    setNewMessage('');
  };

  return (
    <div className="slack-chat-container">
      <div className="slack-chat">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="chat-message-item">
              <span className="chat-message-text">{message.text}</span>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            placeholder="Type your message here..."
            className="chat-input"
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSend} className="chat-send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlackChat;
