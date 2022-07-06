import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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
      return lines[i];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className={`square ${props.winner && "square-winner"}`} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// function Moves(props) {
//   return (
//     a
//   )
// }

// class MoveHistory extends React.Component {
//   render() {
//     return (a)
//   }
// }

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={(this.props.winner && this.props.winner.includes(i))}
      />
    );
  }

  renderRow(row) {
    let content = [];
    for (let col = 0; col < 3; col++) {
      content.push(this.renderSquare(row * 3 + col))
    }
    return(
      <div key={row} className="board-row">
        {content}
      </div>
    )
  }

  renderBoard() {
    const rows = [];
    for (let row=0; row<3; row++) {
      rows.push(this.renderRow(row));
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      historyDesc: true,
      stepNumber: 0,
      xIsNext: true,
    };

    this.handleMoveSortOrder = this.handleMoveSortOrder.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, 
      this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  displayColRowMove(step, prevStep) {
    let newMove;
    for (let i = 0; i < step.squares.length; i++) {
      if (step.squares[i] != prevStep.squares[i]) {
        let x = Math.floor(i / 3);
        let y = i % 3;
        newMove = ' (' + x + ', ' + y + ')';
        break;
      }
    }
    
    return (
      newMove
    )
  }

  buildMovesList(history) {
    let moves = [];

    history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + this.displayColRowMove(step, history[move-1]) :
        'Go to game start';
      moves.push(
        <li key={move}>
          <button
            className={`${this.state.stepNumber===move && "move-selected"}`}
            onClick={() =>this.jumpTo(move)}>{desc}
          </button>
        </li>
      )
    })
    
    return (this.state.historyDesc) ? moves : moves.reverse(); 
  }

  handleMoveSortOrder(e) {
    this.setState({
      historyDesc: e.target.checked
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = this.buildMovesList(history);

    let status;
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else {
      status = 'Next player: ' + 
      (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <p>
            <input
              type="checkbox"
              checked={this.state.historyDesc}
              onChange={this.handleMoveSortOrder}
            />
            Show moves list in descending order
          </p>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
