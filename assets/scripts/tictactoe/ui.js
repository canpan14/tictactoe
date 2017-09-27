'use strict'

const store = require('../store')

const onTurnChange = function (currentPlayer) {
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
}

const updateBoard = function (boardArray) {
  // Update board based on the board array
}

const updateCell = function (cell, marker) {
  cell.innerHTML = marker
}

const onSignUpSuccess = function (response) {
  $('#signUpModal').modal('hide')
  console.log(response)
}

const onSignUpFailure = function (response) {
  $('#signInError').text('Bad sign up attempt.')
  console.log(response)
}

const onSignInSuccess = function (response) {
  store.user = response.user
  $('#loginContainer').hide()
  $('#loginContainer').find('form')[0].reset()
  $('#signedIn').css('display', 'flex')
  console.log(response)
}

const onSignInFailure = function (response) {
  console.log(response)
}

const onSignOutSuccess = function (response) {
  delete store.user
  $('#signedIn').css('display', 'none')
  $('#loginContainer').show()
  console.log(response)
}

const onSignOutFailure = function (response) {
  $('#signedIn').css('display', 'none')
  $('#loginContainer').show()
  console.log(response)
}

module.exports = {
  onTurnChange,
  updateBoard,
  updateCell,
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onSignOutSuccess,
  onSignOutFailure
}
