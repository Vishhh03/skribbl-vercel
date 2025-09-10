import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const Chat = ({ roomId, username }) => {
  const [guess, setGuess] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('newGuess', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('newGuess');
  }, []);

  const sendGuess = () => {
    if (guess.trim()) {
      socket.emit('guess', { roomId, guess, username });
      setGuess('');
    }
  };

  return (
    <div>
      <h3>Chat</h3>
      <input value={guess} onChange={e => setGuess(e.target.value)} placeholder="Type your guess..." />
      <button onClick={sendGuess}>Send</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}><strong>{m.username}:</strong> {m.guess}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
