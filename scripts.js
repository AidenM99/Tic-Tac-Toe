
function createPlayer(sign) {
    const getSign = () => sign
    return { getSign }
}


const gameController = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

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

            if (gameBoard.board[a]  && gameBoard.board[b] === gameBoard.board[a] && gameBoard.board[c] === gameBoard.board[a]) {
                console.log(`Player ${gameBoard.board[a]} wins with the following combination: ${a} ${b} ${c}!`)
            }
        })
    }

    return { winCheck, playerX, playerO }

})();


const gameBoard = (() => {
    let gameSquare = document.querySelectorAll(".square");

    const board = ["", "", "", "", "", "", "", "", ""];

    const updateBoard = (index, sign) => {
        board[index] = sign;
        gameSquare[index].textContent = sign;
        console.log(board)
    }

    return { updateBoard, board }

})();


const displayController = (() => {
    let gameSquare = document.querySelectorAll(".square");

    const _getCurrentSign = () => {
        let count = -1;
        return () => {
            count ++;
            if (count % 2 === 0) return gameController.playerX.getSign();
            return gameController.playerO.getSign();
        }
    };

    const currentSign = _getCurrentSign();

    gameSquare.forEach(square => {
        square.addEventListener("click", function () {
            if (square.textContent != "") return;
            const index = square.dataset.index;
            gameBoard.updateBoard(index, currentSign());
            gameController.winCheck();
        })
    })

})();