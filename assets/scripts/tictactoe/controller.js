'use strict'

const ui = require('./ui')
const gameBoard = require('./gameBoard')
const Player = require('./player')

// Global variables
const players = []
let currentPlayer
let gameOver = false
let turnCounter = 0

// External functions

const getTurnCounter = () => turnCounter

/**
 * Initializes the game state on page load
 * @return {undefined}
 */
const initializeGame = function () {
  gameBoard.resetBoard()
  players.length = 0
  turnCounter = 0
  currentPlayer = null
  gameOver = false
  createPlayers()
  changeTurns()
}

/**
 * Main flow of the game that runs after each board click
 * @param  {event} event Click event from clicking on the game board
 * @return {undefined}
 */
const takeTurn = function (event) {
  if (!isLegalMove(event)) return // Do nothing if illegal move
  makeMove(event) // Make the move on the board
  analyzeBoardState() // Check the new board for a win/draw and handle it
}

/**
 * Resets the current game
 * @return {undefined}
 */
const resetGame = function () {
  gameOver = true
  ui.clearBoard()
  initializeGame()
}

// Interal functions
/**
 * Creates the initial players
 * @return {undefined}
 */
const createPlayers = function () {
  players.push(Player.createPlayer(-1, 'Player 1', 'X'))
  players.push(Player.createPlayer(1, 'Player 2', 'O'))
}

/**
 * Handles a turn change
 * @return {undefined}
 */
const changeTurns = function () {
  turnCounter++
  currentPlayer = turnCounter % 2 !== 0 ? players[0] : players[1]
  ui.onTurnChange(currentPlayer)
}

/**
 * Handles a win
 * @return {undefined}
 */
const win = function () {
  $('#playerTurnText').text(currentPlayer.name + ' wins!')
}

/**
 * Handles a draw
 * @return {undefined}
 */
const draw = function () {
  $('#playerTurnText').text('Draw!')
}

/**
 * Checks if an attempted move is legal
 * @param  {event} event The click event on the board
 * @return {boolean} Return true if move is legal
 */
const isLegalMove = function (event) {
  // If gameover or cell is already filled, ignore
  if (gameOver || event.target.innerHTML) {
    return false
  }
  return true
}

/**
 * Makes the move on the board updating the visual and internal board
 * @param  {event} event The click event on the board
 * @return {undefined}
 */
const makeMove = function (event) {
  ui.updateCell(event.target, currentPlayer.boardMarker) // Update the cell visually
  const cellClicked = event.target.attributes['data-pos'].value.split(',')
  const r = parseInt(cellClicked[0])
  const c = parseInt(cellClicked[1])
  gameBoard.makeMove(currentPlayer, r, c)
}

/**
 * Checks the board for a win or draw and handles it
 * @return {undefined}
 */
const analyzeBoardState = function () {
  if (!gameBoard.checkForWin()) {
    if (turnCounter >= 9) {
      gameOver = true
      draw()
      ui.onDraw()
    } else {
      changeTurns()
    }
  } else {
    gameOver = true
    win()
    ui.onWin()
  }
}

// Exports
module.exports = {
  getTurnCounter,
  initializeGame,
  takeTurn,
  resetGame
}
