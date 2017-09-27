'use strict'

const store = require('../store')

const loginToPlay = function () {
  $('#notification').text('Please login to play')
}

const updateBoard = function (boardArray) {
  // Update board based on the board array
}

const updateCell = function (cell, marker) {
  cell.innerHTML = marker
}

const clearBoard = function () {
  const table = $('#gameBoard')[0]
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      table.rows[i].cells[j].innerHTML = ''
    }
  }
}

const onTurnChange = function (currentPlayer) {
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
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
  $('#notification').text('')
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
  clearBoard()
  $('#signedIn').css('display', 'none')
  $('#loginContainer').show()
  console.log(response)
}

const onSignOutFailure = function (response) {
  $('#signedIn').css('display', 'none')
  $('#loginContainer').show()
  console.log(response)
}

const onChangePasswordSuccess = function (response) {
  $('#changePasswordModal').modal('hide')
  console.log(response)
}

const onChangePasswordFailure = function (response) {
  $('#changePasswordError').text('Bad change password attempt.')
  console.log(response)
}

const onNewGameSuccess = function (response) {
  console.log(response)
}

const onNewGameFailure = function (response) {
  console.log(response)
}

module.exports = {
  loginToPlay,
  onTurnChange,
  updateBoard,
  updateCell,
  clearBoard,
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onSignOutSuccess,
  onSignOutFailure,
  onChangePasswordSuccess,
  onChangePasswordFailure,
  onNewGameSuccess,
  onNewGameFailure
}
