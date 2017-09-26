'use strict'

const ui = require('./tictactoe/ui')
const gameBoard = require('./tictactoe/gameBoard')

// Player contructor
const Player = function (id, name, boardMarker) {
  this.id = id
  this.name = name
  this.boardMarker = boardMarker
}

// Global variables
const players = []
let currentPlayer
let gameOver = false
let turnCounter = 0

// Creates initial players
const createPlayers = function () {
  players.push(new Player(-1, 'Player 1', 'X'))
  players.push(new Player(1, 'Player 2', 'O'))
}

// Swaps player turns
const changeTurns = function () {
  if (currentPlayer.id === players[0].id) {
    currentPlayer = players[1]
  } else {
    currentPlayer = players[0]
  }
  ui.onTurnChange(currentPlayer)
}

const win = function () {
  $('#playerTurnText').text(currentPlayer.name + ' wins!')
}

const draw = function () {
  $('#playerTurnText').text('Draw!')
}

const isGameOver = () => gameOver

const takeTurn = function (event) {
  event.target.innerHTML = currentPlayer.boardMarker
  const cellClicked = event.target.attributes['data-pos'].value.split(',')
  const r = parseInt(cellClicked[0])
  const c = parseInt(cellClicked[1])
  turnCounter++
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

const initializeGame = function () {
  createPlayers()
  currentPlayer = players[0]
  $('#playerTurnText').text(players[0].name + '\'s turn')
}

// https://stackoverflow.com/questions/22464605/convert-a-1d-array-to-2d-array
// Takes in 1D array returns new 2D array (9 length to 3 by 3)
const convertArray1Dto2D = function (arr) {
  const newArr = []
  while (arr.length) newArr.push(arr.splice(0, 3))
  return newArr
}

// Takes in 2D array returns 1D array (3 by 3 to 9 length)
const convertArray2Dto1D = function (arr) {
  const newArr = arr.reduce((a, b) => {
    a.concat(b)
  })
  return newArr
}

module.exports = {
  initializeGame,
  isGameOver,
  takeTurn,
  convertArray1Dto2D,
  convertArray2Dto1D
}
