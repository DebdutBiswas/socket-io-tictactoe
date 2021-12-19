# socket-io-tictactoe
A simple console based TicTacToe game.

## Codesandbox.io playground link:
- https://codesandbox.io/s/socket-io-tictactoe-l8txw

## Install required node modules:
- npm install

## How to run the code?
### First, start the server:

- npm start

### Start clients one by one like below:

- npm run client1-test
- npm run client1-test

Remember: Open each of the clients in a seperate command / bash terminal

## User Inputs / Outputs:
- All the inputs and outputs will be in only client command / bash terminal.
- Server termnal outputs verbose related to player / client and game move activity.
- Client terminal takes one move input at a time, ranging from 1 to 9.
- Client terminal outputs tic-tac-toe game board after each player move.

### Example Input / Output:
#### Input:
\> 5
#### Output:
... <br />
.x. <br />
... <br />

## Game Design:
### Game Server:
- A socket.io based server responsible for listening to player events, managing players and game rooms, handling game logic.
### Clients:
- A socket.io-client based client responsible for sending player moves, events to server and listening game results from server.
