
function createPlayer(sign) {
    return { sign }
}


const gameController = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

    const winnerContainer = document.querySelector(".winner-container");
    const winnerAnnouncement = document.querySelector(".winner-announcement");

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

        winningCombinations.forEach(row => {
            const a = row[0];
            const b = row[1];
            const c = row[2];

            if (gameBoard.board[a] && gameBoard.board[b] === gameBoard.board[a] && gameBoard.board[c] === gameBoard.board[a]) {
                winnerAnnouncement.textContent = `Player ${gameBoard.board[a]} wins!`;
                winnerContainer.style.display = "block";
            };
        });
    };

    return { winCheck, playerX, playerO, winnerContainer }

})();


const gameBoard = (() => {
    const gameSquare = document.querySelectorAll(".square");

    const board = ["", "", "", "", "", "", "", "", ""];

    const updateBoard = (index, sign) => {
        board[index] = sign;
        gameSquare[index].textContent = sign;
    }

    const resetBoard = () => {
        gameController.winnerContainer.style.display = "none";
        for (i = 0; i < board.length; i++) {
            board[i] = "";
        };
        gameSquare.forEach(square => {
            square.textContent = "";
        });
        displayController.currentSign.reset();
    };


    return { updateBoard, resetBoard, board }

})();


const displayController = (() => {
    const turnText = document.querySelector(".current-turn");
    const gameSquare = document.querySelectorAll(".square");
    const resetButton = document.querySelector(".reset");

    const getCurrentSign = () => {
        let count = -1;
        const counter = () => {
            count++;
            currentTurn(count);
            if (count % 2 === 0) {
                return gameController.playerX.sign;
            }
            return gameController.playerO.sign;
        };
        counter.reset = () => {
            count = -1;
            turnText.textContent = `It's player X's turn`;
        };

        return counter
    };

    const currentSign = getCurrentSign();

    const currentTurn = (count) => {
        count % 2 === 0 ? turnText.textContent = `It's player O's turn` : turnText.textContent = `It's player X's turn`;
    }

    gameSquare.forEach(square => {
        square.addEventListener("click", function () {
            if (square.textContent != "") return;
            const index = square.dataset.index;
            gameBoard.updateBoard(index, currentSign());
            gameController.winCheck();
        })
    });

    resetButton.addEventListener("click", () => {
        gameBoard.resetBoard();
    });

    return { currentSign }

})();