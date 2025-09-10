// App.jsx
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
  const [drawer, setDrawer] = useState('');
  const [round, setRound] = useState(0);
  const [wordToDraw, setWordToDraw] = useState('');
  const [correctGuess, setCorrectGuess] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on('playerList', setPlayers);
    socket.on('startRound', ({ drawerName, round, time }) => {
      setDrawer(drawerName);
      setRound(round);
      setTimeLeft(time);
      setCorrectGuess(null);
      setWordToDraw('');
    });
    socket.on('wordToDraw', setWordToDraw);
    socket.on('correctGuess', ({ username, word }) => {
      setCorrectGuess(`${username} guessed the word "${word}"!`);
    });
    socket.on('timer', setTimeLeft);
    socket.on('gameOver', ({ leaderboard }) => {
      setGameOver(true);
      setLeaderboard(leaderboard);
    });

    return () => {
      socket.off('playerList');
      socket.off('startRound');
      socket.off('wordToDraw');
      socket.off('correctGuess');
      socket.off('timer');
      socket.off('gameOver');
    };
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
      ) : gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <h3>Leaderboard:</h3>
          <ul>
            {leaderboard.map(p => (
              <li key={p.id}>{p.username} — {p.score} pts</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="game">
          <h2>Room: {roomId}</h2>
          <h3>Round: {round}</h3>
          <h3>Drawer: {drawer}</h3>
          <h3>Time Left: {timeLeft}s</h3>
          {wordToDraw && <p>Your word: <strong>{wordToDraw}</strong></p>}
          {correctGuess && <p className="correct">{correctGuess}</p>}
          <ul>
            {players.map(p => (
              <li key={p.id}>{p.username} — Score: {p.score}</li>
            ))}
          </ul>
          <Canvas roomId={roomId} />
          <Chat roomId={roomId} username={username} />
        </div>
      )}
    </div>
  );
}

export default App;
