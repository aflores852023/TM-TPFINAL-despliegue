// src/components/SlackChat.jsx
import React, { useState } from 'react';
import './SlackChat.css';

const SlackChat = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      onSendMessage({ text });
      setText('');
    }
  };

  return (
    <form className="wd-message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="wd-message-input"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="wd-send-button">
        Enviar
      </button>
    </form>
  );
};

export default SlackChat;
