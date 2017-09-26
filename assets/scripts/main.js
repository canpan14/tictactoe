'use strict'

// Player contructor
const Player = function (id, name, boardMarker) {
  this.id = id
  this.name = name
  this.boardMarker = boardMarker
}

// Global variables
const players = []
const boardArray = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
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
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
}

// Checks for win based on last play
const checkForWin = function (r, c) {
  if (checkHorizontalWin(r) || checkVerticalWin(c) || checkDiagonalWin(r, c)) {
    gameOver = true
    win()
  } else {
    turnCounter++
    if (turnCounter >= 9) {
      gameOver = true
      draw()
    }
  }
  return gameOver
}

const checkHorizontalWin = function (r) {
  if (boardArray[r][0] + boardArray[r][1] + boardArray[r][2] === currentPlayer.id * 3) {
    return true
  }
  return false
}

const checkVerticalWin = function (c) {
  if (boardArray[0][c] + boardArray[1][c] + boardArray[2][c] === currentPlayer.id * 3) {
    return true
  }
  return false
}

const checkDiagonalWin = function (r, c) {
  let isWin = false
  if (r === c) {
    isWin = checkDownRight()
  }
  if ((r === 0 & c === 2) || (r === 2 & c === 0)) {
    isWin = checkDownLeft()
  }
  return isWin
}

const checkDownRight = function () {
  if (boardArray[0][0] + boardArray[1][1] + boardArray[2][2] === currentPlayer.id * 3) {
    return true
  }
  return false
}

const checkDownLeft = function () {
  if (boardArray[0][2] + boardArray[1][1] + boardArray[2][0] === currentPlayer.id * 3) {
    return true
  }
  return false
}

const win = function () {
  $('#playerTurnText').text(currentPlayer.name + ' wins!')
}

const draw = function () {
  $('#playerTurnText').text('Draw!')
}

const isGameOver = () => gameOver

const fillBox = function (event) {
  event.target.innerHTML = currentPlayer.boardMarker
  const cellClicked = event.target.attributes['data-pos'].value.split(',')
  const r = parseInt(cellClicked[0])
  const c = parseInt(cellClicked[1])
  boardArray[r][c] = currentPlayer.id
  if (!checkForWin(r, c)) {
    changeTurns()
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
  fillBox,
  convertArray1Dto2D,
  convertArray2Dto1D
}
