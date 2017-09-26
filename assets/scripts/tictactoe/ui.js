'use strict'

const onTurnChange = function (currentPlayer) {
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
}

const updateBoard = function (boardArray) {
  // Update board based on the board array
}

const onSignUpSuccess = function (response) {
  console.log(response)
}

const onSignUpFailure = function (response) {
  console.log(response)
}

module.exports = {
  onTurnChange,
  updateBoard,
  onSignUpSuccess,
  onSignUpFailure
}
