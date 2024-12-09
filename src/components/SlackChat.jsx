
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
        <div className="slack-chat-container">
            <form className="chat-input-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Escribe un mensaje..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="chat-send-button">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default SlackChat;
