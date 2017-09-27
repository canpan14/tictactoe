'use strict'

const ui = require('./ui')
const gameBoard = require('./gameBoard')
const Player = require('./player')

// Global variables
const players = []
let currentPlayer
let gameOver = false
let turnCounter = 0

// Creates initial players
const createPlayers = function () {
  players.push(Player.createPlayer(-1, 'Player 1', 'X'))
  players.push(Player.createPlayer(1, 'Player 2', 'O'))
}

// Swaps player turns
const changeTurns = function () {
  turnCounter++
  currentPlayer = turnCounter % 2 !== 0 ? players[0] : players[1]
  ui.onTurnChange(currentPlayer)
}

// What to do on a win
const win = function () {
  $('#playerTurnText').text(currentPlayer.name + ' wins!')
}

// What to do on a draw
const draw = function () {
  $('#playerTurnText').text('Draw!')
}

// Main game flow
// Update clicked cell
const takeTurn = function (event) {
  if (!isLegalMove(event)) return
  ui.updateCell(event.target, currentPlayer.boardMarker)
  const cellClicked = event.target.attributes['data-pos'].value.split(',')
  const r = parseInt(cellClicked[0])
  const c = parseInt(cellClicked[1])
  gameBoard.makeMove(currentPlayer, r, c)
  if (!gameBoard.checkForWin()) {
    if (turnCounter >= 9) {
      gameOver = true
      draw()
    } else {
      changeTurns()
    }
  } else {
    gameOver = true
    win()
  }
}

const isLegalMove = function (event) {
  // If gameover or cell is already filled, ignore
  if (gameOver || event.target.innerHTML) {
    return false
  }
  return true
}

const initializeGame = function () {
  createPlayers()
  changeTurns()
}

module.exports = {
  initializeGame,
  takeTurn
}
