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
        startGame();
        if (e.target.value === "AI") return isAI = true;
        isAI = false;
    };

    const startGame = () => {
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

    const clearSquares = () => {
        gameSquare.forEach(square => {
            square.classList.remove("purple");
            square.classList.remove("blue");
            square.textContent = "";
        });
    };

    const showWinner = (board, tie) => {
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
    };
})();


const gameController = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

    let currentPlayer = playerX.sign;

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const aiPlay = () => {
        if (gameBoard.board.every(ele => ele === "X" || ele === "O")) return;
        let num;
        do {
            num = randomMove();
        } while (typeof gameBoard.board[num] != "number");
        fillSquare(num);
        winCheck(gameBoard.board, getCurrentPlayer());
    };

    const randomMove = () => {
        const randomNum = Math.floor(Math.random() * gameBoard.board.length);
        return randomNum;
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
        let winningCombo = false;

        winningCombinations.forEach(row => {
            const a = row[0];
            const b = row[1];
            const c = row[2];

            if (board[a] === sign && board[b] === sign && board[c] === sign) {
                displayController.showWinner(board[a]);
                winningCombo = true;
            };

            if (board.every(ele => typeof ele != "number" && !winningCombo)) {
                displayController.showTie();
            };
        });
        return winningCombo;
    };

    const reset = () => {
        displayController.winnerText.innerHTML = `Player <span class="winning-sign"></span> Wins!</p>`;
        displayController.currentTurn.innerHTML = "Current Turn: <span class='blue'>Player O</span>";
        displayController.clearSquares();
        displayController.hideWinner();
        winCheck(gameBoard.board);
        currentPlayer = playerX.sign;
        gameBoard.resetBoard();
    };

    /*const emptySquares = () => {
        return gameBoard.board.filter(ele => typeof ele === "number");
    };
 
    const minimax = (board, sign) => {
        const availSpots = emptySquares(board);
 
        const humanSign = "O";
        const aiSign = "X";
 
        if (winCheck(gameBoard.board, humanSign)) {
            return { score: -10 }
        } else if (winCheck(gameBoard.board, aiSign)) {
            return { score: 10 }
        } else if (availSpots.length === 0) {
            return { score: 0 }
        };
    };*/

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
