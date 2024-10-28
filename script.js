let board,
    game = new Chess(),
    difficulty = 'easy';

const onDragStart = (source, piece, position, orientation) => {
    // Разрешаем перетаскивание только своих фигур
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

const makeBestMove = () => {
    const possibleMoves = game.moves({ verbose: true });

    if (possibleMoves.length === 0) return;

    let move;

    // Логика в зависимости от уровня сложности
    switch (difficulty) {
        case 'easy':
            // Легкий уровень - случайный ход
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            move = possibleMoves[randomIndex].san;
            break;
        case 'medium':
            // Средний уровень - выбираем более стратегический ход
            move = possibleMoves[0].san; // Можно улучшить, добавив более сложную логику
            break;
        case 'hard':
            // Сложный уровень - улучшенная логика (можно добавить альфа-бета отсечение и т.д.)
            move = possibleMoves[0].san; // Заменить более сложной логикой
            break;
    }

    game.move(move);
    board.position(game.fen());
    renderMoveHistory(game.history());

    if (game.game_over()) {
        alert('Игра окончена');
    }
};

const renderMoveHistory = moves => {
    const historyElement = document.getElementById('status');
    historyElement.innerHTML = 'История ходов: ' + moves.join(', ');
};

const onDrop = (source, target) => {
    // Пробуем сделать ход
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // всегда превращаем в ферзя
    });

    // Если ход неудачный, возвращаем фигуру на место
    if (move === null) return 'snapback';

    renderMoveHistory(game.history());

    // Если игра окончена, уведомляем
    if (game.game_over()) {
        alert('Игра окончена');
    } else {
        // Делаем ход компьютера
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

// Установка уровня сложности
document.getElementById('difficulty').addEventListener('change', (event) => {
    difficulty = event.target.value;
});

// Кнопки управления
document.getElementById('startBtn').addEventListener('click', board.start);
document.getElementById('clearBtn').addEventListener('click', board.clear);
document.getElementById('nextMoveBtn').addEventListener('click', () => {
    if (game.game_over()) {
        alert('Игра окончена');
    } else {
        makeBestMove();
    }
});
