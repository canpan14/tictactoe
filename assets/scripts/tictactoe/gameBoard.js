'use strict'

const boardArray = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

const makeMove = function (player, row, col) {
  boardArray[row][col] = player
  return checkForWin()
}

// Checks for win based on last play
const checkForWin = function () {
  if (checkHorizontalWin() || checkVerticalWin() || checkDiagonalWin()) {
    return true
  }
  return false
}

const resetBoard = function () {
  for (let i = 0; i < boardArray.length; i++) {
    for (let j = 0; j < boardArray[i].length; j++) {
      boardArray[i][j] = 0
    }
  }
}

const checkHorizontalWin = function () {
  for (let i = 0; i < boardArray.length; i++) {
    if (isArrayAllSameValues(boardArray[i])) {
      return true
    }
  }
  return false
}

const checkVerticalWin = function (c) {
  for (let i = 0; i < boardArray[0].length; i++) {
    if (isArrayAllSameValues([boardArray[0][i], boardArray[1][i], boardArray[2][i]])) {
      return true
    }
  }
  return false
}

const checkDiagonalWin = function (r, c) {
  return checkDownLeft() || checkDownRight()
}

const checkDownRight = function () {
  if (isArrayAllSameValues([boardArray[0][0], boardArray[1][1], boardArray[2][2]])) {
    return true
  }
  return false
}

const checkDownLeft = function () {
  if (isArrayAllSameValues([boardArray[0][2], boardArray[1][1], boardArray[2][0]])) {
    return true
  }
  return false
}

const isArrayAllSameValues = function (arr) {
  return arr.every(ele => {
    return (ele === arr[0] && ele !== 0)
  })
}

module.exports = {
  makeMove,
  checkForWin,
  resetBoard
}
