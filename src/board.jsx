import { useState } from 'react';

function Square({ value, onSquareClick, isHighlighted }) {
  return (
    <button
      className={`square ${isHighlighted ? 'highlighted' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ XIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  let winner = null;
  let winningLine = null;

  if (result) {
    [winner, winningLine] = result;
  }

  function handleClick(index, row, col) {
    if (squares[index] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[index] = XIsNext ? 'X' : 'O';
    onPlay(nextSquares, `(${row}, ${col})`);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${XIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="board">
      <div className="status">{status}</div>
      {[0, 1, 2].map(i => (
        <div key={i} className="board-row">
          {[0, 1, 2].map(j => {
            const index = i * 3 + j;
            const isHighlighted = winningLine && winningLine.includes(index);
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index, i, j)}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const XIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, moveLocation) {
    const newHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: moveLocation }
    ];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((entry, move) => {
    const { location } = entry;
    let description = move
      ? `Go to move #${move}${location ? ' at ' + location : ''}`
      : 'Go to game start';

    return (
      <li key={move}>
        {move === currentMove ? (
          <p className="current-move">You are at move {move} {location || ''}</p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board XIsNext={XIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>Toggle order</button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

/* ------------------------------
   Helper: Calculate Winner
------------------------------ */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}
