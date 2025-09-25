// App.jsx
import Board from './board.jsx';
import { useState } from 'react';
import './App.css';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [XIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setXIsNext(!XIsNext);
  }

  return (
    <Board 
      squares={squares} 
      XIsNext={XIsNext} 
      onPlay={handlePlay} 
    />
  );
}

export default App;
