/*
 * TicTacToe socket.io game
 * Author: Debdut Biswas
 * This file is responsible for player related utility functions
 */

//Array of players
const players = [];

//Join player to the game
function joinPlayer(id, username, game) {
  const player = { id, username, game };
  players.push(player);
  return player;
}

//Get current player
function getCurrentPlayer(id) {
  return players.find(player => player.id === id);
}

//Player leaves game
function leavePlayer(id) {
  const index = players.findIndex(player => player.id === id);

  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
}

//Get game players
function getPlayers(game) {
  return players.filter(player => player.game === game);
}

module.exports = {
  joinPlayer,
  getCurrentPlayer,
  leavePlayer,
  getPlayers
};