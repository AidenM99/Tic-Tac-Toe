
function createPlayer(sign) {
    const getSign = () => sign
    return { getSign }
}


const gameController = (() => {
    const playerX = createPlayer("X");
    const playerO = createPlayer("O");

    let count = -1;

    const getCurrentSign = () => {
        count++;
        if (count % 2 === 0) return playerX.getSign()
        return playerO.getSign()
    }

    return { getCurrentSign }
})();


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
            if (square.textContent != "") return;
            const index = square.dataset.index;
            gameBoard.updateBoard(index, gameController.getCurrentSign());
        })
    })

})();