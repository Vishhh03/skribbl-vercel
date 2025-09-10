import React from 'react';

const Lobby = ({ roomId, setRoomId, username, setUsername, joinRoom }) => (
  <div className="lobby">
    <h2>Join a Room</h2>
    <input placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
    <button onClick={joinRoom}>Join</button>
  </div>
);

export default Lobby;
