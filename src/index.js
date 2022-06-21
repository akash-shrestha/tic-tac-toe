import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="board-squares">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}

        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}

        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          columnRow: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  resetState() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          columnRow: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const columnRow = current.columnRow.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    columnRow[this.state.stepNumber] = calulateColumnRow(i);
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          columnRow: columnRow,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let buttonClass = null;
      if (move === this.state.stepNumber) {
        buttonClass = "bold";
      }
      const desc = move ? "Go to move #" + move : "Go to game start";
      const colRow = move ? "(" + step.columnRow[move - 1] + ")" : "";
      return (
        <li key={move}>
          <button className={buttonClass} onClick={() => this.jumpTo(move)}>
            {desc} {colRow}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner + " ! 🥳";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X 🎯" : "O 🎯");
    }

    return (
      <div className="game">
        <button className="new-game" onClick={() => this.resetState()}>
          New Game
        </button>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <p className={status.includes("!") ? "winner" : "player-info"}>
            {status}
          </p>
          <p className="game-history-title">Game history:</p>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const calulateColumnRow = (i) => {
  let j = i + 1;
  if (j <= 3) {
    return j + "," + 1;
  }
  if (j <= 6) {
    return j - 3 + "," + 2;
  }
  return j - 6 + "," + 3;
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
