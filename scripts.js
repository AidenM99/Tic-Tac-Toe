
function createPlayer(sign) {
    const getSign = () => sign
    return { getSign }
}

const gameBoard = (() => {
    let gameSquare = document.querySelectorAll(".square");

    const board = ["", "", "", "", "", "", "", "", ""];

    const updateBoard = (index, sign) => {
        board[index] = sign;
        gameSquare[index].textContent = sign;
    }

    return { updateBoard }

})();

const displayController = (() => {
    let gameSquare = document.querySelectorAll(".square");

    gameSquare.forEach(square => {
        square.addEventListener("click", function () {
            const index = square.dataset.index;
            gameBoard.updateBoard(index, players.sign());
        })
    })

})();

const players = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

    return {
        sign: () => {
            return playerX.getSign()
        }
    }
})();