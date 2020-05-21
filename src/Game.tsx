import React, { useState, useCallback } from 'react';
import './Game.css';

interface SquareProps {
    onClickOnSquare: HandleClickOnSquare
    value: string;
    index: number;
}

const Square: React.FC<SquareProps> = (props) => {
    return (
        <button
            className="Square"
            onClick={() => props.onClickOnSquare(props.index)}
        >
            {props.value}
        </button>
    );
};

interface BoardProps {
    squares: Array<string>;
    onClickOnSquare: HandleClickOnSquare
}

const Board: React.FC<BoardProps> = (props) => {

    function renderSquare(i: number) {
        return (
            <Square
                value={props.squares[i]}
                onClickOnSquare={props.onClickOnSquare}
                index={i}
            />);
    }

    return (
        <div className="Game__Board">
            <div className="Board__Row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="Board__Row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="Board__Row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

export const Game: React.FC = () => {

    const [history, setHistory] = useState<GameHistory>(
        [
            {
                squares: Array(9).fill(null),
            }
        ]
    );
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const handleClickOnSquare = useCallback((index: number) => {
        const tmpHistory = history.slice(0, stepNumber + 1);
        const current = tmpHistory[tmpHistory.length - 1];
        const squares = current.squares.slice();

        // Ignore click if has won or square is already filled
        if (calculateWinner(squares) || squares[index]) return;

        squares[index] = xIsNext ? 'X' : 'O';
        setHistory(tmpHistory.concat(
            [{
                squares: squares,
            }]
        ));
        setStepNumber(tmpHistory.length);
        setXIsNext(!xIsNext);
    }, [history, stepNumber, xIsNext]);

    const jumpTo = useCallback((step: number) => {
        setHistory(
            history.slice(0, step + 1)
        );
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }, [history]);

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go back to move n°' + move :
            'Go back to the start of the party';

        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status: string;
    if (winner) {
        status = winner + ' won !';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <div className="Game">
            <Board
                squares={current.squares}
                onClickOnSquare={handleClickOnSquare}
            />
            <div className="Game__Info">
                <p className="Game__Status">{status}</p>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares: Array<string>): string | null {
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