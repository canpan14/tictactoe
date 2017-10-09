'use strict'

const arrayHelpers = require('./arrayHelpers')

const boardArray = [[], [], []]

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
    boardArray[i] = []
  }
}

const get1DBoard = function () {
  return arrayHelpers.convertArray2Dto1D(boardArray)
}

const get2DBoard = function () {
  return boardArray
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
  arr = arr.filter(ele => ele !== undefined)
  if (arr.length < 3) return false
  console.log(arr)
  return arr.every(ele => {
    return (ele === arr[0] && ele !== null && ele !== undefined && !!ele === true)
  })
}

module.exports = {
  makeMove,
  checkForWin,
  resetBoard,
  get1DBoard,
  get2DBoard
}
