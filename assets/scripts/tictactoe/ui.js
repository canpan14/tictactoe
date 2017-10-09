'use strict'

const store = require('../store')

const loginToPlay = function () {
  notificationMessage('Please login to play')
}

const updateCell = function (cell, marker) {
  cell.innerHTML = marker
}

const activateButtons = function () {
  $('#newGame').attr('disabled', false)
  $('#newOnlineGame').attr('disabled', false)
  $('#joinGameButton').attr('disabled', false)
  $('#viewGameButton').attr('disabled', false)
}

const deactivateButtons = function () {
  $('#newGame').attr('disabled', true)
  $('#newOnlineGame').attr('disabled', true)
  $('#joinGameButton').attr('disabled', true)
  $('#viewGameButton').attr('disabled', true)
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

const greenNotification = function (text, time) {
  $.notify({
    message: text
  }, {
    type: 'success',
    placement: {
      from: 'top',
      align: 'center'
    },
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    delay: time,
    timer: 1000
  })
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

const clearSignInForm = function (event) {
  $(event.target).find('form')[0].reset()
  $('#signInError').text('')
}

const clearSignUpForm = function (event) {
  $(event.target).find('form')[0].reset()
  $('#signUpError').text('')
}

const clearChangePasswordForm = function (event) {
  $(event.target).find('form')[0].reset()
  $('#changePasswordError').text('')
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
  $('#signInError').text('Bad sign up attempt')
}

const onSignInSuccess = function (response) {
  $('#signInModal').modal('hide')
  store.user = response.user
  setTimeout(() => {
    greenNotification('Signed In Succesfully', 3000)
  }, 500)
  activateButtons()
  $('#signedInAs').text('Signed in as ' + store.user.id)
  $('#badLoginAttempt').text('')
  $('#notification').text('')
  $('.signedOutLink').hide()
  $('.signedInLink').show()
}

const onSignInFailure = function (response) {
  $('#badLoginAttempt').text('Bad email or password')
}

const onSignOutSuccess = function () {
  delete store.user
  delete store.game
  clearBoard()
  deactivateButtons()
  $('#playerTurnText').text('')
  $('#gamesPlayed').text('')
  $('#gamesFinished').text('')
  $('#notification').text('')
  $('#currentGameId').text('')
  $('#successMessage').text('')
  $('#viewGameMessage').text('')
  $('.signedInLink').hide()
  $('.signedOutLink').show()
}

const onSignOutFailure = function (response) {
  // If signout fails it's because there is an auth issue so they should
  // be forced to relog which is the same as a sign out success in this case
  onSignOutSuccess()
}

const onChangePasswordSuccess = function () {
  $('#changePasswordModal').modal('hide')
  successMessage('Change Password Successful', 5000)
}

const onChangePasswordFailure = function (response) {
  $('#changePasswordError').text('Bad change password attempt')
}

const onNewOfflineGameSuccess = function (response) {
  notificationMessage('')
  $('#viewGameMessage').text('')
  store.game = response.game
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onNewOfflineGameFailure = function (response) {
  notificationMessage('Failed to start a new game')
}

const onUpdateGameSuccess = function (response) {
  notificationMessage('')
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
  $('#viewGameMessage').text('')
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onJoinGameFailure = function (response) {
  notificationMessage('Failed to join game')
}

const onNewOnlineGameSuccess = function () {
  notificationMessage('')
  $('#viewGameMessage').text('')
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onNewOnlineGameFailure = function (response) {
  notificationMessage('Failed to start a new online game')
}

const onShowGameSuccess = function (response) {
  delete store.game
  $('#playerTurnText').text('')
  $('#currentGameId').text('')
  $('#successMessage').text('')
  notificationMessage('')
  $('#viewGameMessage').text('Viewing game ' + response.game.id)
  const gameBoardCells = $('#gameBoard td')
  for (let i = 0; i < gameBoardCells.length; i++) {
    gameBoardCells[i].innerHTML = response.game.cells[i].toUpperCase()
  }
}

const onShowGameFailure = function (response) {
  notificationMessage('Could not view game')
}

const onOnlineTimeout = function () {
  notificationMessage('Game timed out')
}

module.exports = {
  loginToPlay,
  onTurnChange,
  updateCell,
  clearBoard,
  notificationMessage,
  successMessage,
  clearSignInForm,
  clearSignUpForm,
  clearChangePasswordForm,
  onOnlineTimeout,
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
  onNewOfflineGameSuccess,
  onNewOfflineGameFailure,
  onUpdateGameSuccess,
  onUpdateGameFailure,
  onGetGamesForUserSuccess,
  onGetGamesForUserFailure,
  onJoinGameSuccess,
  onJoinGameFailure,
  onNewOnlineGameSuccess,
  onNewOnlineGameFailure,
  onShowGameSuccess,
  onShowGameFailure
}
