'use strict'

const ui = require('./ui')
const gameBoard = require('./gameBoard')
const Player = require('./player')
const Move = require('./move')
const store = require('../store')

// Global variables
const players = []
let currentPlayer = null
let gameOver = false
let turnCounter = 0
let recentMove = null
let isOnlineCanMove = false
let isOnlineGame = false
let isOtherPlayerJoin = false

// External functions
const isGameOver = () => gameOver

const getTurnCounter = () => turnCounter

const getRecentMove = () => recentMove

const newOfflineGame = function () {
  clearCurrentGame()
  initializeVariables(false)
}

const newOnlineGame = function () {
  clearCurrentGame()
  initializeVariables(true)
}

const clearCurrentGame = function () {
  gameOver = true
  isOnlineCanMove = false
  gameBoard.resetBoard()
  ui.clearBoard()
}

const initializeVariables = function (isOnline = false) {
  isOnlineGame = isOnline
  isOnlineCanMove = false
  players.length = 0
  turnCounter = 0
  currentPlayer = null
  recentMove = Move.createMove()
  gameOver = false
  createPlayers()
  changeTurns()
}

const takeTurn = function (event) {
  if (!isLegalMove(event)) return false
  if (isOnlineGame) isOnlineCanMove = false
  makeMove(event) // Make the move on the board
  analyzeBoardState() // Check the new board for a win/draw and handle it
  return true
}

const setOnlineGame = function (isOnline) {
  isOnlineGame = isOnline
}

const setGameOver = function (over) {
  gameOver = over
}

const otherPlayerJoin = function (id) {
  isOnlineGame = true
  isOnlineCanMove = true
  isOtherPlayerJoin = true
  players[1] = Player.createPlayer(id, 'Player ' + id, 'O')
  currentPlayer = players[0]
}

const otherPlayerUpdate = function (cell) {
  const cellRow = Math.floor(cell.index / 3)
  const cellColumn = cell.index % 3
  ui.updateCell($('*[data-pos=\'' + cellRow + ',' + cellColumn + '\']').get(0), cell.value.toUpperCase())
  recentMove.index = cellRow * 3 + cellColumn
  recentMove.value = cell.value
  gameBoard.makeMove(currentPlayer, cellRow, cellColumn)
  analyzeBoardState()
  isOnlineCanMove = true
}

const joinExisitingGame = function (playerId) {
  isOnlineGame = true
  isOtherPlayerJoin = true
  players[0] = Player.createPlayer(playerId, 'Player ' + playerId, 'X')
  players[1] = Player.createPlayer(store.user.id, 'Player ' + store.user.id, 'O')
  currentPlayer = players[0]
  ui.onTurnChange(players[0])
}

// Interal functions
/**
 * Creates the initial players
 * @return {undefined}
 */
const createPlayers = function () {
  players.push(Player.createPlayer(store.user.id, 'Player ' + store.user.id, 'X'))
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
  if (gameOver) {
    ui.gameIsOver()
    return false
  }
  if (event.target.innerHTML) {
    return false
  }
  if (isOnlineGame) {
    if (!isOtherPlayerJoin) {
      ui.onlineWaitForOtherPlayer()
      return false
    }
    if (!isOnlineCanMove) {
      ui.onlineNotYourTurn()
      return false
    }
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
  recentMove.index = r * 3 + c // Set index to move location on a 1D array
  currentPlayer === players[0] ? recentMove.value = 'x' : recentMove.value = 'o' // Set value
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
  recentMove.isEndGame = gameOver
}

// Exports
module.exports = {
  getTurnCounter,
  initializeVariables,
  takeTurn,
  getRecentMove,
  isGameOver,
  setGameOver,
  otherPlayerUpdate,
  joinExisitingGame,
  otherPlayerJoin,
  isLegalMove,
  setOnlineGame,
  newOfflineGame,
  newOnlineGame
}
