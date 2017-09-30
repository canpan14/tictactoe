'use strict'

const store = require('../store')

const loginToPlay = function () {
  notificationMessage('Please login to play')
}

const updateCell = function (cell, marker) {
  cell.innerHTML = marker
}

const activateNewGameButtons = function () {
  $('#newGame').attr('disabled', false)
  $('#newOnlineGame').attr('disabled', false)
}

const clearBoard = function () {
  $('#notification').text('')
  $('#successMessage').text('')
  const table = $('#gameBoard')[0]
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      table.rows[i].cells[j].innerHTML = ''
    }
  }
}

const notificationMessage = function (text) {
  $('#notification').text(text)
}

const successMessage = function (text, time) {
  $('#successMessage').text(text)
  setTimeout(() => {
    $('#successMessage').text('')
  }, time)
}

const onTurnChange = function (currentPlayer) {
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
}

const onWin = function () {
  $('#newGame').attr('disabled', false)
}

const onDraw = function () {
  $('#newGame').attr('disabled', false)
}

const onSignUpSuccess = function (response) {
  $('#signUpModal').modal('hide')
  successMessage('Sign Up Successful', 5000)
}

const onSignUpFailure = function (response) {
  $('#signInError').text('Bad sign up attempt.')
}

const onSignInSuccess = function (response) {
  store.user = response.user
  $('#badLoginAttempt').text('')
  $('#notification').text('')
  $('#loginContainer').hide()
  $('#loginContainer').find('form')[0].reset()
  $('#signedIn').css('display', 'flex')
  $('#joinGameButton').attr('disabled', false)
}

const onSignInFailure = function (response) {
  $('#badLoginAttempt').text('Bad email or password')
}

const onSignOutSuccess = function () {
  delete store.user
  clearBoard()
  $('#newGame').attr('disabled', true)
  $('#newOnlineGame').attr('disabled', true)
  $('#joinGameButton').attr('disabled', true)
  $('#playerTurnText').text('')
  $('#gamesPlayed').text('')
  $('#gamesFinished').text('')
  $('#notification').text('')
  $('#currentGameId').text('')
  $('#successMessage').text('')
  $('#signedIn').css('display', 'none')
  $('#loginContainer').show()
}

const onSignOutFailure = function (response) {
  $('#signedIn').css('display', 'none')
  $('#loginContainer').show()
}

const onChangePasswordSuccess = function () {
  $('#changePasswordModal').modal('hide')
  successMessage('Change Password Successful', 5000)
}

const onChangePasswordFailure = function (response) {
  $('#changePasswordError').text('Bad change password attempt.')
}

const onNewGameSuccess = function (response) {
  notificationMessage('')
  store.game = response.game
  $('#currentGameId').text('')
}

const onNewGameFailure = function (response) {
  notificationMessage('Failed to start a new game')
}

const onUpdateGameSuccess = function (response) {
}

const onUpdateGameFailure = function (response) {
  notificationMessage('Failed to update game on server')
}

const onGetGamesForUserSuccess = function (response) {
  const gamesFinished = response.games.filter(game => game.over === true).length
  $('#gamesPlayed').text('Player has played ' + response.games.length + ' games')
  $('#gamesFinished').text('Player has finished ' + gamesFinished + ' games')
}

const onGetGamesForUserFailure = function (response) {
  notificationMessage('Failed to get user stats')
  $('#gamesPlayed').text('')
  $('#gamesFinished').text('')
}

const onJoinGameSuccess = function (response) {
  store.game = response.game
}

const onJoinGameFailure = function (response) {
  notificationMessage('Failed to join game')
}

const onNewOnlineGameSuccess = function () {
  notificationMessage('')
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onNewOnlineGameFailure = function (response) {
  notificationMessage('Failed to start a new online game')
}

module.exports = {
  loginToPlay,
  onTurnChange,
  updateCell,
  clearBoard,
  notificationMessage,
  successMessage,
  onWin,
  onDraw,
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onSignOutSuccess,
  onSignOutFailure,
  onChangePasswordSuccess,
  onChangePasswordFailure,
  onNewGameSuccess,
  onNewGameFailure,
  onUpdateGameSuccess,
  onUpdateGameFailure,
  onGetGamesForUserSuccess,
  onGetGamesForUserFailure,
  onJoinGameSuccess,
  onJoinGameFailure,
  activateNewGameButtons,
  onNewOnlineGameSuccess,
  onNewOnlineGameFailure
}
