'use strict'

const onTurnChange = function (currentPlayer) {
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
}

const updateBoard = function (boardArray) {
  // Update board based on the board array
}

const onSignUpSuccess = function (response) {
  $('#signUpModal').modal('hide')
  console.log(response)
}

const onSignUpFailure = function (response) {
  $('#signInError').text('Bad sign up attempt.')
  console.log(response)
}

module.exports = {
  onTurnChange,
  updateBoard,
  onSignUpSuccess,
  onSignUpFailure
}
