/*
 * TicTacToe socket.io game
 * Author: Debdut Biswas
 * This file is responsible for game client functionality
 */

const socketio = require('socket.io-client');
const readline = require('readline');

//const rl = readline.createInterface({input: process.stdin, output: process.stdout});
//Has to disable readLine output for wired echoing behaviour
const rl = readline.createInterface({input: process.stdin});
const socket = socketio.connect(`http://${process.argv[2]}:${process.argv[3]}`, {reconnect: true});

//Check if successfuly connected to game server
socket.on('connect', message => {
    console.log('Connected...');
    //socket.emit('message', `Hello from client ${socket.id}`);
});

//Check for existing game
socket.on('getGames', ({ games }) => {
    //Filter games not occupied by both players
    games = games.filter(game => game.players.length < 2);
    let username = 'x';
    let game = {};

    if (games.length > 0) {
        for(game of games) {
            if (game.players.length === 0) {
                //console.log('x not exists!');
                username = 'x';
                game.players.push(username);
                break;
            } else if (game.players.length === 1) {
                //console.log('x/o exists!');
                if (game.players[0] === 'o') username = 'x';
                else if (game.players[0] === 'x') username = 'o';
                game.players.push(username);
                break;
            }
        }

        //Send join game acknowledgement to the server
        socket.emit('joinGame', { username, game });
    } else if (games.length === 0) {
        //Send occupied / empty games found for triggering new game creation
        socket.emit('emptyGames');
    }
});

//Listen for game messages from both players in a game
socket.on('message', message => {
    console.log(`${message}`);
    sendMove();
});

//Listen for any game moves from both players in a game
socket.on('gameMove', move => {
    console.log(`${move}`);
    sendMove();
});

//Listen for winner declaration
socket.on('winnerDeclared', declaration => {
    console.log(declaration);
    socket.disconnect();
    process.exit(0);
});

//Get game move from console and send it to server
function sendMove() {
    //Has to use process.stdout for avoiding newline of console.log
    process.stdout.write('> ');
    rl.question('', playerMove => {
        //Check for resignation of current player
        if (playerMove === 'r') {
            rl.close();
            socket.disconnect();
            console.log(`You resigned!`);
            process.exit(0);
        } else {
            //Send game move to the server
            socket.emit('gameMove', playerMove);
            rl.pause();
        }
    });
}