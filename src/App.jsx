import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Lobby from './components/Lobby';
import Canvas from './components/Canvas';
import Chat from './components/Chat';
import './index.css';

function App() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('playerList', setPlayers);
    return () => socket.off('playerList');
  }, []);

  const joinRoom = () => {
    if (roomId && username) {
      socket.emit('joinRoom', { roomId, username });
      setJoined(true);
    }
  };

  return (
    <div className="container">
      {!joined ? (
        <Lobby roomId={roomId} setRoomId={setRoomId} username={username} setUsername={setUsername} joinRoom={joinRoom} />
      ) : (
        <div className="game">
          <h2>Room: {roomId}</h2>
          <h3>Players:</h3>
          <ul>{players.map(p => <li key={p.id}>{p.username}</li>)}</ul>
          <Canvas roomId={roomId} />
          <Chat roomId={roomId} username={username} />
        </div>
      )}
    </div>
  );
}

export default App;
