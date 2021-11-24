function createPlayer(sign) {
    return { sign }
};


const displayController = (() => {
    const buttonContainer = document.querySelector(".opponent-button-container");
    const startMenuContainer = document.querySelector(".start-menu-container");
    const opponentButtons = document.querySelectorAll(".opponent-button");
    const winnerContainer = document.querySelector(".winner-container");
    const gameContainer = document.querySelector(".game-container");
    const subHeading = document.querySelector(".sub-heading");
    const currentTurn = document.querySelector(".current-turn");
    const winnerText = document.querySelector(".winner-text");
    const backArrow = document.querySelector(".back-arrow");
    const gameSquare = document.querySelectorAll(".square");
    const difficulty = document.querySelector(".difficulty");
    const resetButton = document.querySelector(".reset");

    let isAI = false;

    const aiCheck = () => {
        return isAI;
    };

    opponentButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            initialiseGame(e);
        });
    });

    const initialiseGame = (e) => {
        if (e.target.value === "AI") {
            isAI = true;
        } else {
            isAI = false;
        };
        startGame();
    };

    const startGame = () => {
        if (aiCheck()) {
            difficulty.style.display = "block";
            difficulty.innerHTML = "Difficulty: <span class='purple'>Normal</span>";
        } else {
            difficulty.style.display = "none";
        };
        startMenuContainer.style.height = "200px";
        buttonContainer.style.display = "none";
        gameContainer.style.display = "block";
        subHeading.style.display = "none";
    };

    const closeGame = () => {
        startMenuContainer.style.height = null;
        buttonContainer.style.display = null;
        gameContainer.style.display = null;
        subHeading.style.display = null;
    };

    difficulty.addEventListener("click", () => {
        difficultyMode();
        gameController.reset();
    });

    const difficultyMode = () => {
        difficulty.textContent.includes("Normal") ? difficulty.innerHTML = "Difficulty: <span class='red'>Insane</span>" :
            difficulty.innerHTML = "Difficulty: <span class='purple'>Normal</span>"
    };

    const clearSquares = () => {
        gameSquare.forEach(square => {
            square.classList.remove("purple");
            square.classList.remove("blue");
            square.textContent = "";
        });
    };

    const showWinner = (board) => {
        winnerText.textContent = `Player ${board} Wins!`;
        winnerContainer.style.display = "block";
    };

    const showTie = () => {
        winnerText.textContent = "It's a tie!";
        winnerContainer.style.display = "block";
    };

    const hideWinner = () => {
        winnerContainer.style.display = "none";
    }

    gameSquare.forEach(square => {
        square.addEventListener("click", function () {
            if (square.textContent != "") return;
            const index = square.dataset.index;
            gameController.makeMove(index);
        });
    });

    resetButton.addEventListener("click", () => {
        gameController.reset();
    });

    backArrow.addEventListener("click", () => {
        gameController.reset();
        closeGame();
    });

    return {
        aiCheck,
        clearSquares,
        showWinner,
        showTie,
        hideWinner,
        currentTurn,
        winnerText,
        difficulty,
    };
})();


const gameController = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

    let gameOver;

    let currentPlayer = playerX.sign;

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const aiPlay = () => {
        if (gameBoard.board.every(ele => ele === "X" || ele === "O")) return;
        if (displayController.difficulty.textContent.includes("Normal")) {
            let num;
            do {
                num = randomMove();
            } while (typeof gameBoard.board[num] != "number");
            fillSquare(num);
        } else {
            const bestMove = minimax(gameBoard.board, switchSign());
            gameBoard.updateBoard(bestMove.index, getCurrentPlayer());
            winCheck(gameBoard.board, getCurrentPlayer());
        };
    };

    const randomMove = () => {
        return Math.floor(Math.random() * gameBoard.board.length);
    };

    const makeMove = (index) => {
        fillSquare(index);
        const result = winCheck(gameBoard.board, getCurrentPlayer());
        if (result) return;
        if (displayController.aiCheck()) aiPlay();
    };

    const fillSquare = (index) => {
        gameBoard.updateBoard(index, switchSign());
    };

    const switchSign = () => {
        if (getCurrentPlayer() === playerX.sign) {
            displayController.currentTurn.innerHTML = "Current Turn: <span class='purple'>Player X</span>";
            return currentPlayer = playerO.sign;
        };
        displayController.currentTurn.innerHTML = "Current Turn: <span class='blue'>Player O</span>";
        return currentPlayer = playerX.sign;
    };

    const winningCombinations = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // first column
        [1, 4, 7], // second column
        [2, 5, 8], // last column
        [0, 4, 8], // last column
        [2, 5, 8], // diagonal 1
        [2, 4, 6]  // diagonal 2
    ];

    const winCheck = (board, sign) => {

        winningCombinations.forEach(row => {
            const a = row[0];
            const b = row[1];
            const c = row[2];

            if (board[a] === sign && board[b] === sign && board[c] === sign) {
                displayController.showWinner(board[a]);
                gameOver = true;
            };

            if (board.every(ele => typeof ele != "number" && !gameOver)) {
                displayController.showTie();
                gameOver = true;
            };
        });
        return gameOver;
    };

    const evaluateMove = (board, sign) => {
        if (
            (board[0] === sign && board[1] === sign && board[2] === sign) ||
            (board[3] === sign && board[4] === sign && board[5] === sign) ||
            (board[6] === sign && board[7] === sign && board[8] === sign) ||
            (board[0] === sign && board[3] === sign && board[6] === sign) ||
            (board[1] === sign && board[4] === sign && board[7] === sign) ||
            (board[2] === sign && board[5] === sign && board[8] === sign) ||
            (board[0] === sign && board[4] === sign && board[8] === sign) ||
            (board[2] === sign && board[4] === sign && board[6] === sign)
        ) {
            return true;
        } else {
            return false;
        };
    };

    const emptySquares = (newBoard) => {
        return newBoard.filter(ele => typeof ele === "number");
    };

    const minimax = (newBoard, sign) => {
        const availSpots = emptySquares(newBoard);

        if (evaluateMove(newBoard, "O")) {
            return { score: -10 }
        } else if (evaluateMove(newBoard, "X")) {
            return { score: 10 }
        } else if (availSpots.length === 0) {
            return { score: 0 }
        };

        var moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            var move = {};

            move.index = newBoard[availSpots[i]];

            newBoard[availSpots[i]] = sign;

            if (sign === "X") {
                var outcome = minimax(newBoard, "O");
                move.score = outcome.score;
            } else {
                var outcome = minimax(newBoard, "X");
                move.score = outcome.score;
            };

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        };

        let bestMove = null;

        if (sign === "X") {
            let bestScore = -Infinity;
            for (i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                };
            };
        };

        return moves[bestMove]
    };

    const reset = () => {
        displayController.winnerText.innerHTML = `Player <span class="winning-sign"></span> Wins!</p>`;
        displayController.currentTurn.innerHTML = "Current Turn: <span class='blue'>Player O</span>";
        displayController.clearSquares();
        displayController.hideWinner();
        gameOver = undefined;
        gameBoard.resetBoard();
        currentPlayer = playerX.sign;
        winCheck(gameBoard.board);
    };

    return {
        reset,
        aiPlay,
        getCurrentPlayer,
        makeMove,
    };

})();


const gameBoard = (() => {
    const gameSquare = document.querySelectorAll(".square");

    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const updateBoard = (index, sign) => {
        if (sign === "X") gameSquare[index].classList.add("purple");
        gameSquare[index].classList.add("blue");
        board[index] = sign;
        gameSquare[index].textContent = sign;
    };

    const resetBoard = () => {
        for (i = 0; i < board.length; i++) {
            board[i] = i;
        };
    };

    return {
        updateBoard,
        resetBoard,
        board,
    };
})();
