function createPlayer(sign) {
    return { sign }
};


const displayController = (() => {
    const buttonContainer = document.querySelector(".opponent-button-container");
    const opponentButtons = document.querySelectorAll(".opponent-button");
    const winnerModal = document.querySelector(".winner-modal");
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
            difficulty.innerHTML = "Difficulty: <span class='green'>Easy</span>";
        } else {
            difficulty.style.display = "none";
        };
        buttonContainer.style.display = "none";
        gameContainer.style.display = "block";
        subHeading.style.display = "none";
    };

    const closeGame = () => {
        buttonContainer.style.display = null;
        gameContainer.style.display = null;
        subHeading.style.display = null;
    };

    gameSquare.forEach(square => {
        square.addEventListener("click", function () {
            if (square.textContent != "") return;
            const index = square.dataset.index;
            gameController.makeMove(index);
        });
    });

    const clearSquares = () => {
        gameSquare.forEach(square => {
            square.classList.remove("purple");
            square.classList.remove("blue");
            square.textContent = "";
        });
    };


    const difficultyMode = () => {
        if (difficulty.textContent.includes("Impossible")) {
            difficulty.innerHTML = "Difficulty: <span class='green'>Easy</span>";
        } else if (difficulty.textContent.includes("Easy")) {
            difficulty.innerHTML = "Difficulty: <span class='purple'>Normal</span>";
        } else if (difficulty.textContent.includes("Normal")) {
            difficulty.innerHTML = "Difficulty: <span class='orange'>Hard</span>";
        } else if (difficulty.textContent.includes("Hard")) {
            difficulty.innerHTML = "Difficulty: <span class='red'>Impossible</span>";
        };
    };

    const changeTurnText = (sign) => {
        sign === "X" ? currentTurn.innerHTML = "Current Turn: <span class='purple'>Player X</span>" :
            currentTurn.innerHTML = "Current Turn: <span class='blue'>Player O</span>";
    };

    const showWinner = (board) => {
        winnerText.textContent = `Player ${board} Wins!`;
        winnerModal.style.display = "block";
    };

    const showTie = () => {
        winnerText.textContent = "It's a tie!";
        winnerModal.style.display = "block";
    };

    const hideWinner = () => {
        winnerModal.style.display = "none";
    };

    difficulty.addEventListener("click", () => {
        difficultyMode();
        reset();
    });

    resetButton.addEventListener("click", () => {
        reset();
    });

    backArrow.addEventListener("click", () => {
        reset();
        closeGame();
    });

    const reset = () => {
        winnerText.innerHTML = `Player <span class="winning-sign"></span> Wins!</p>`;
        currentTurn.innerHTML = "Current Turn: <span class='blue'>Player O</span>";
        clearSquares();
        hideWinner();
        gameController.resetBoard();
        gameController.resetPlayer();
    };

    const getDifficulty = () => {
        if (difficulty.textContent.includes("Easy")) return "Easy";
        if (difficulty.textContent.includes("Normal")) return "Normal";
        if (difficulty.textContent.includes("Hard")) return "Hard";
        if (difficulty.textContent.includes("Impossible")) return "Impossible";
    };

    return {
        aiCheck,
        showWinner,
        showTie,
        changeTurnText,
        getDifficulty,
    };
})();


const gameController = (() => {
    const gameSquare = document.querySelectorAll(".square");
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const playerO = createPlayer("O");
    const playerX = createPlayer("X");
    let currentPlayer = playerX.sign;

    const resetPlayer = () => {
        currentPlayer = playerX.sign;
    };

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

    const makeMove = (index) => {
        fillSquare(index);
        const result = evaluateMove(board, getCurrentPlayer());
        if (result || getCurrentPlayer() == "X") return;
        if (displayController.aiCheck()) aiPlay();
    };

    const aiPlay = () => {
        if (board.every(ele => ele === "X" || ele === "O")) return;

        const difficultySlider = Math.floor(Math.random() * 101);
        
        // AI picks random move or perfect move depending on number generated and difficulty setting
        if (
            (displayController.getDifficulty() === "Easy" && difficultySlider <= 50) ||
            (displayController.getDifficulty() === "Normal" && difficultySlider <= 30) ||
            (displayController.getDifficulty() === "Hard" && difficultySlider <= 20)
        ) {
            const availSpots = emptySquares(board);
            const getRandomIndex = Math.floor(Math.random() * availSpots.length);
            const randomAvailIndex = availSpots[getRandomIndex];
            makeMove(randomAvailIndex);
        } else {
            const bestMove = minimax(board, changePlayers());
            updateBoard(bestMove.index, getCurrentPlayer());
            evaluateMove(board, getCurrentPlayer());
        };
    };

    const evaluateMove = (board, sign, isEvaluating) => {
        let gameOver = false;
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
            if (isEvaluating) return true;
            displayController.showWinner(getCurrentPlayer());
            gameOver = true;
        } else {
            if (isEvaluating) return false;
            if (board.every(ele => typeof ele != "number" && !gameOver)) {
                displayController.showTie();
                gameOver = true;
            };
        };
        return gameOver;
    };

    const changePlayers = () => {
        if (getCurrentPlayer() === playerX.sign) {
            displayController.changeTurnText("X");
            return currentPlayer = playerO.sign;
        } else {
            displayController.changeTurnText("O");
            return currentPlayer = playerX.sign;
        };
    };

    const emptySquares = (newBoard) => {
        return newBoard.filter(ele => typeof ele === "number");
    };

    const fillSquare = (index) => {
        updateBoard(index, changePlayers());
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const minimax = (newBoard, sign) => {
        // Find available spaces on the board
        const availSpots = emptySquares(newBoard); 
        // Prevent evaluateMove() from ending the game when AI is simulating moves 
        let isEvaluating = true; 
        // Return a 'score' value if a terminal state on the board is found
        if (evaluateMove(newBoard, "O", isEvaluating)) {
            return { score: -10 }
        } else if (evaluateMove(newBoard, "X", isEvaluating)) {
            return { score: 10 }
        } else if (availSpots.length === 0) {
            return { score: 0 }
        };
        // Record the outcome of each simulation
        const moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            var move = {};
            // Index in move obj equals current iteration of 'i'
            move.index = newBoard[availSpots[i]];
            // Current sign 'i' is iterating over on filtered board is set to 'X' or 'O'
            newBoard[availSpots[i]] = sign;
            // Recursively run the minimax function for the altered board
            if (sign === "X") {
                const outcome = minimax(newBoard, "O");
                // Save the score from evaluateMove() into the move object
                move.score = outcome.score;
            } else {
                const outcome = minimax(newBoard, "X");
                move.score = outcome.score;
            };
            // Reset the current board back to the state it was before a move was made
            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        };

        let bestMove = null;
        // Locate the reference for the best move found
        if (sign === "X") {
            let bestScore = -Infinity;
            for (i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                };
            };
        } else {
            let bestScore = Infinity;
            for (i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                };
            };
        };

        return moves[bestMove];
    };

    return {
        makeMove,
        resetBoard,
        resetPlayer,
    };
})();