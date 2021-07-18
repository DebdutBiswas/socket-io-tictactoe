/*
 * TicTacToe socket.io game
 * Author: Debdut Biswas
 * This file is responsible for game logic related utility functions
 */

module.exports = class {
    #gameId;

    firstActivePlayerFlag = false;
    activePlayer = 'x'; //x: 1st player, o: 2nd player
    moveCount = 0;
    gameStates = Array(9).fill('.'); //.: Empty, x: 1st player, o: 2nd player
    winningStates = [[0,1,2], /* xxx */
                              /* ooo */
                              /* ooo */
                    
                     [3,4,5], /* ooo */
                              /* xxx */
                              /* ooo */
                    
                     [6,7,8], /* ooo */
                              /* ooo */
                              /* xxx */
                    
                     [0,4,8], /* xoo */
                              /* oxo */
                              /* oox */
                    
                     [2,4,6], /* oox */
                              /* oxo */
                              /* xoo */
                    
                     [0,      /* xoo */
                      3,      /* xoo */
                      6],     /* xoo */
                    
                     [1,      /* oxo */
                      4,      /* oxo */
                      7],     /* oxo */
                    
                     [2,      /* oox */
                      5,      /* oox */
                      8]];    /* oox */
    
    wonFlag = false;
    winner;
    xScore = 0;
    oScore = 0;

    constructor(gameId) {
        this.#gameId = gameId;
    }

    get getId() {
        return this.#gameId;
    }
    
    makeMove(currentPlayer, currentMove) {
        //Adjust indexing to match with gameStates
        currentMove--;

        if (!this.firstActivePlayerFlag) {
            this.activePlayer = currentPlayer;
            this.firstActivePlayerFlag = true;
        }

        if (this.gameStates[currentMove] === '.' && currentPlayer === this.activePlayer && !this.wonFlag) {
            this.moveCount++;
    
            if (this.activePlayer === 'x') {
                this.gameStates[currentMove] = 'x';
                this.activePlayer = 'o';
            } else {
                this.gameStates[currentMove] = 'o';
                this.activePlayer = 'x';
            }
    
            for(let winningState of this.winningStates){
                if(this.gameStates[winningState[0]] === this.gameStates[winningState[1]] &&
                        this.gameStates[winningState[1]] === this.gameStates[winningState[2]] &&
                        this.gameStates[winningState[0]] !== '.') {
    
                    this.wonFlag = true;
                    
                    if(this.gameStates[winningState[0]] === 'o') {
                        this.oScore++;
                        this.winner = 'o';
                    } else if(this.gameStates[winningState[0]] === 'x') {
                        this.xScore++;
                        this.winner = 'x';
                    }
                }
            }
        }
    }
};