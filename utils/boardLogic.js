/*
 * TicTacToe socket.io game
 * Author: Debdut Biswas
 * This file is responsible for game board related utility functions
 */

//Printing board positions
function printBoard(gameStates = Array(9).fill('.')) {
    let boardPositions = '\n';

    for(let idx = 0; idx < 9; idx+=3) {
        boardPositions += (gameStates[idx] + gameStates[idx + 1] + gameStates[idx + 2] + '\n');
    }

    return boardPositions;
}

module.exports = printBoard;