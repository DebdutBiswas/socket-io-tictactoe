/*
 * TicTacToe socket.io game
 * Author: Debdut Biswas
 * This file is responsible for game related utility functions
 */

const ticTacToeLogic = require('./gameLogic');

//Array of games
const games = [];

//Create a new game
function createGame(id, players = []) {
    const gameLogic = new ticTacToeLogic(id);
    const game = { id, players, gameLogic };
    games.push(game);
    return game;
}

// Get current game
function getCurrentGame(id) {
    return games.find(game => game.id === id);
}

//Get all games
function getGames() {
    return games;
}

//Add player to a game
function addPlayerToGame(id, player) {
    games.find(game => game.id === id).players.push(player);
}

//Remove player from game
function removePlayerFromGame(id, player) {
    const players = games.find(game => game.id === id).players;
    const index = players.findIndex(currentPlayer => currentPlayer === player);

    if (index !== -1) {
      return players.splice(index, 1)[0];
    }
}

module.exports = {
    createGame,
    getCurrentGame,
    getGames,
    addPlayerToGame,
    removePlayerFromGame
};