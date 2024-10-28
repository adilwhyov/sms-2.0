let board,
    game = new Chess(),
    difficulty = 'hard';

// Оценка позиции
const evaluateBoard = (game) => {
    if (game.in_checkmate()) {
        return game.turn() === 'w' ? -Infinity : Infinity; // Если белые в мате, это плохо
    }
    if (game.in_draw()) {
        return 0; // Ничья
    }

    let totalEvaluation = 0;
    const pieceValues = {
        'p': 10,
        'r': 50,
        'n': 30,
        'b': 30,
        'q': 90,
        'k': 900
    };

    // Оценка всех фигур на доске
    for (let piece of game.board()) {
        for (let p of piece) {
            if (p) {
                const pieceValue = pieceValues[p.type];
                totalEvaluation += p.color === 'w' ? pieceValue : -pieceValue;
            }
        }
    }

    // Пример оценки контроля центра
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    centerSquares.forEach(square => {
        const piece = game.get(square);
        if (piece) {
            totalEvaluation += piece.color === 'w' ? 5 : -5; // Увеличивает оценку за контроль центра
        }
    });

    return totalEvaluation;
};

const minimax = (depth, game, isMaximizing) => {
    if (depth === 0 || game.game_over()) {
        return evaluateBoard(game);
    }

    const possibleMoves = game.ugly_moves();
    if (isMaximizing) {
        let bestMove = -Infinity;
        for (const move of possibleMoves) {
            game.move(move);
            const value = minimax(depth - 1, game, false);
            game.undo();
            bestMove = Math.max(bestMove, value);
        }
        return bestMove;
    } else {
        let bestMove = Infinity;
        for (const move of possibleMoves) {
            game.move(move);
            const value = minimax(depth - 1, game, true);
            game.undo();
            bestMove = Math.min(bestMove, value);
        }
        return bestMove;
    }
};

const findBestMove = (game) => {
    let bestMove = null;
    let bestValue = -Infinity;

    const possibleMoves = game.ugly_moves();
    for (const move of possibleMoves) {
        game.move(move);
        const moveValue = minimax(4, game, false); // Увеличенный уровень глубины
        game.undo();

        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }
    return bestMove;
};

const makeBestMove = () => {
    const bestMove = findBestMove(game);
    if (bestMove) {
        game.move(bestMove);
        board.position(game.fen());
        renderMoveHistory(game.history());
    }

    if (game.game_over()) {
        alert('Игра окончена');
    }
};

const renderMoveHistory = moves => {
    const historyElement = document.getElementById('status');
    historyElement.innerHTML = 'История ходов: ' + moves.join(', ');
};

const onDrop = (source, target) => {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    renderMoveHistory(game.history());

    if (game.game_over()) {
        alert('Игра окончена');
    } else {
        setTimeout(makeBestMove, 250);
    }
};

const cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

board = ChessBoard('board', cfg);

document.getElementById('difficulty').addEventListener('change', (event) => {
    difficulty = event.target.value;
});

document.getElementById('startBtn').addEventListener('click', board.start);
document.getElementById('clearBtn').addEventListener('click', board.clear);
document.getElementById('nextMoveBtn').addEventListener('click', () => {
    if (game.game_over()) {
        alert('Игра окончена');
    } else {
        makeBestMove();
    }
});
