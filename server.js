/*
 * TicTacToe socket.io game
 * Author: Debdut Biswas
 * This file is responsible for game server functionality
 */

const http = require('http');
const socketio = require('socket.io');
const crypto = require("crypto");

const formatMessage = require('./utils/messages');
const { joinPlayer, getCurrentPlayer, leavePlayer, getPlayers } = require('./utils/players');
const { createGame, getCurrentGame, getGames, addPlayerToGame, removePlayerFromGame } = require('./utils/games');
const printBoard = require('./utils/boardLogic');

const server = http.createServer();
const io = socketio(server);

//Run game server mechanism everytime on a successful client connection
io.on('connection', socket => {

    //Get and store all games
    let currentGames = getGames();

    //Send all existing games
    socket.emit('getGames', {
        games: currentGames
    });

    //Listen for join game
    socket.on('joinGame', ({ username, game }) => {
        //Join a new user and store user information
        const currentUser = joinPlayer(socket.id, username, game.id);

        //Join current user to a game
        socket.join(currentUser.game);

        //Update player list of current game
        addPlayerToGame(game.id, username);

        //Welcome current user
        socket.emit('message', `Welcome to TicTacToe, user: ${currentUser.username}, game: ${game.id}`);

        //Broadcast a new user joined
        console.log(`User: ${currentUser.username} with id: ${currentUser.id} joined to game: ${game.id}`);
        //socket.broadcast.to(currentUser.game).emit('message', `User: ${currentUser.username} with id: ${currentUser.id} joined to game: ${game.id}`);
        
        //Send users and games info to both player in a game
        io.to(currentUser.game).emit('gameUsers', {
            game: currentUser.game,
            users: getPlayers(currentUser.game)
        });
    });

    //Listen for empty games acknowledgement
    socket.on('emptyGames', () => {
        //Generate game id
        const gameId = crypto.randomBytes(64).toString('base64').slice(0, 16).replace(/\/|\+/g, '');
        
        //Create a new game
        createGame(gameId);

        //Create game logic for current game
        //let gameLogic = new ticTacToeLogic(gameId);

        //Get and store all games
        currentGames = getGames();

        //Send all existing games
        socket.emit('getGames', {
            games: currentGames
        });
    });
    
    //Listen for game messages
    socket.on('message', message => {
        //console.log(`Message from: ${socket.id}, message: ${message}`);
        console.log(`Message from: ${currentUser.username} with id: ${currentUser.id}, message: ${message}`);
    });

    //Listen for game moves
    socket.on('gameMove', move => {
        //Get current user from current socket id
        const currentUser = getCurrentPlayer(socket.id);

        //Get current game from current user
        const currentGame = getCurrentGame(currentUser.game);

        //Send game moves to both players in current game
        console.log(`Game move from: ${currentUser.username} with id: ${currentUser.id}, move: ${move}`);
        //io.to(currentUser.game).emit('message', `Game move from: ${currentUser.username} with id: ${currentUser.id}, move: ${move}`);

        //Send current move to current game logic handler for current game
        currentGame.gameLogic.makeMove(currentUser.username, move);

        //Send board positions to both players
        io.to(currentUser.game).emit('message', printBoard(currentGame.gameLogic.gameStates));

        //Check for winner
        if (currentGame.gameLogic.wonFlag) {
            if (currentGame.gameLogic.winner === 'x') {
                io.to(currentUser.game).emit('winnerDeclared', `Game won by first player: x.`);
            } else if (currentGame.gameLogic.winner === 'o') {
                io.to(currentUser.game).emit('winnerDeclared', `Game won by second player: o.`);
            }
        } else {
            if (currentGame.gameLogic.moveCount > 8) {
                io.to(currentUser.game).emit('winnerDeclared', `Game is tied.`);
            }
        }
    });

    //Listen for any client disconnects
    socket.on('disconnect', () => {
        //Remove current user from user list
        const currentUser = leavePlayer(socket.id);
        
        //Check if current user was present in the users list before removal
        if (currentUser) {
            //Send user left acknowledgement to remaining player in current game
            console.log(`User: ${currentUser.username} with id: ${currentUser.id} left!`);
            //io.to(currentUser.game).emit('message', `User: ${currentUser.username} with id: ${currentUser.id} left!`);
            
            //Send users and games info to remaining player in current game
            io.to(currentUser.game).emit('gameUsers', {
                game: currentUser.game,
                users: getPlayers(currentUser.game)
            });

            //Send game over to other user for this user's resignation
            io.to(currentUser.game).emit('winnerDeclared', `Player ${currentUser.username} resigned!`);
        }
    });
});

const PORT = process.argv[2] || 3000;

server.listen(PORT, () => {
    console.log(`Server port: ${PORT}`);
});