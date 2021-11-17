
const initialiseGame = (() => {
    const subHeading = document.querySelector(".sub-heading");
    const gameContainer = document.querySelector(".game-container");
    const opponentButton = document.querySelectorAll(".opponent-button");
    const startMenuContainer = document.querySelector(".start-menu-container");
    const buttonContainer = document.querySelector(".opponent-button-container");

    opponentButton.forEach(button => {
        button.addEventListener("click", (e) => {
            startGame(e.target.value);
        });
    });

    const startGame = () => {
        startMenuContainer.style.height = "200px";
        buttonContainer.style.display = "none";
        gameContainer.style.display = "block";
        subHeading.style.display = "none";
    };

    const closeGame = () => {
        gameContainer.style.display = null;
        subHeading.style.display = null;
        buttonContainer.style.display = null;
        startMenuContainer.style.height = null;
    };

    return { closeGame }
})();


function createPlayer(sign) {
    return { sign }
};


const gameController = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

    let currentPlayer = playerO.sign;

    const winnerContainer = document.querySelector(".winner-container");
    const winnerText = document.querySelector(".winner-text");

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

    const winCheck = () => {
        if (winnerContainer.style.display === "block") return winnerContainer.style.display = "none";

        let winningCombo = false;

        winningCombinations.forEach(row => {
            const a = row[0];
            const b = row[1];
            const c = row[2];

            if (gameBoard.board[a] && gameBoard.board[b] === gameBoard.board[a] && gameBoard.board[c] === gameBoard.board[a]) {
                winnerText.textContent = `Player ${gameBoard.board[a]} Wins!`;
                winnerContainer.style.display = "block";
                winningCombo = true;
                return;
            };

            if (gameBoard.board.every(ele => ele != "" && !winningCombo)) {
                winnerText.textContent = "It's a tie!"
                winnerContainer.style.display = "block";
                return;
            };
        });
    };

    const reset = () => {
        displayController.currentTurn.innerHTML = "Current Turn: <span class='purple'>Player X</span>";
        winnerText.innerHTML = `Player <span class="winning-sign"></span> Wins!</p>`
        gameController.currentPlayer = playerO.sign;
        displayController.clearSquares();
        gameBoard.resetBoard();
        winCheck();
    };

    return { playerX, playerO, currentPlayer, winnerContainer, winCheck, reset }
})();


const gameBoard = (() => {
    const gameSquare = document.querySelectorAll(".square");

    const board = ["", "", "", "", "", "", "", "", ""];

    const updateBoard = (index, sign) => {
        if (sign === "X") gameSquare[index].classList.add("purple");
        gameSquare[index].classList.add("blue");
        gameSquare[index].textContent = sign;
        board[index] = sign;
    };

    const resetBoard = () => {
        for (i = 0; i < board.length; i++) {
            board[i] = "";
        };
    };

    return { updateBoard, resetBoard, board }
})();


const displayController = (() => {
    const currentTurn = document.querySelector(".current-turn");
    const gameSquare = document.querySelectorAll(".square");
    const backArrow = document.querySelector(".back-arrow");
    const resetButton = document.querySelector(".reset");

    gameSquare.forEach(square => {
        square.addEventListener("click", function () {
            if (square.textContent != "") return;
            const index = square.dataset.index;
            appendSign(index);
        });
    });

    const currentSign = () => {
        if (gameController.currentPlayer === gameController.playerX.sign) {
            currentTurn.innerHTML = "Current Turn: <span class='purple'>Player X</span>";
            return gameController.currentPlayer = gameController.playerO.sign;
        };
        currentTurn.innerHTML = "Current Turn: <span class='blue'>Player O</span>";
        return gameController.currentPlayer = gameController.playerX.sign;
    };

    const appendSign = (index) => {
        gameBoard.updateBoard(index, currentSign());
        gameController.winCheck();
    };

    resetButton.addEventListener("click", () => {
        gameController.reset();
    });

    backArrow.addEventListener("click", () => {
        gameController.reset();
        initialiseGame.closeGame();
    });

    const clearSquares = () => {
        gameSquare.forEach(square => {
            square.classList.remove("purple");
            square.classList.remove("blue");
            square.textContent = "";
        });
    };

    return { clearSquares, appendSign, currentTurn }
})();