'use strict'

const store = require('../store')

const signInToPlay = function () {
  redNotification('Please sign in to play', 1000)
}

const updateCell = function (cell, marker) {
  cell.innerHTML = marker
}

const startNewGameToPlay = function () {
  redNotification('Start a local or online game to play', 1000)
}

const onlineWaitForOtherPlayer = function () {
  redNotification('Wait for another play to join', 1000)
}

const onlineNotYourTurn = function () {
  redNotification('It is not your turn', 1000)
}

const joiningAnotherGame = function () {
  greenNotification('Successfully joined game', 1000)
}

const otherPlayerJoined = function () {
  greenNotification('Another played joined your game', 1000)
}

const gameIsOver = function () {
  redNotification('Game has ended, start a new game to play', 1000)
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

const greenNotification = function (text, time = 1000) {
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
    allow_dismiss: false,
    z_index: 1070,
    delay: time,
    timer: 500
  })
}

const redNotification = function (text, time = 1000) {
  $.notify({
    message: text
  }, {
    type: 'danger',
    placement: {
      from: 'top',
      align: 'center'
    },
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    allow_dismiss: false,
    z_index: 1070,
    delay: time,
    timer: 500
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
}

const clearSignUpForm = function (event) {
  $(event.target).find('form')[0].reset()
}

const clearChangePasswordForm = function (event) {
  $(event.target).find('form')[0].reset()
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
  successMessage('Sign Up Successful', 2000)
}

const onSignUpFailure = function (response) {
  redNotification('Email taken or passwords don\'t match', 1000)
}

const onSignInSuccess = function (response) {
  $('#signInModal').modal('hide')
  store.user = response.user
  greenNotification('Signed In Succesfully', 1000)
  activateButtons()
  $('#signedInAs').text('Signed in as ' + store.user.id)
  $('#badLoginAttempt').text('')
  $('#notification').text('')
  $('.signedOutLink').hide()
  $('.signedInLink').show()
}

const onSignInFailure = function (response) {
  redNotification('Incorrect email or password', 1000)
}

const onSignOutSuccess = function () {
  greenNotification('Signed out successfully', 1000)
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
  greenNotification('Password changed successfully', 1000)
}

const onChangePasswordFailure = function (response) {
  redNotification('Old or new passwords invalid', 1000)
}

const onNewOfflineGameSuccess = function (response) {
  notificationMessage('')
  $('#viewGameMessage').text('')
  store.game = response.game
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onNewOfflineGameFailure = function (response) {
  redNotification('Failed to start a new game', 1000)
}

const onUpdateGameSuccess = function (response) {
  notificationMessage('')
}

const onUpdateGameFailure = function (response) {
  redNotification('Failed to update game on server', 1000)
}

const onGetGamesForUserSuccess = function (response) {
  const gamesFinished = response.games.filter(game => game.over === true).length
  $('#gamesPlayed').text('Player has played ' + response.games.length + ' games')
  $('#gamesFinished').text('Player has finished ' + gamesFinished + ' games')
}

const onGetGamesForUserFailure = function (response) {
  redNotification('Failed to get user stats', 1000)
  $('#gamesPlayed').text('')
  $('#gamesFinished').text('')
}

const onJoinGameSuccess = function (response) {
  store.game = response.game
  $('#viewGameMessage').text('')
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onJoinGameFailure = function (response) {
  redNotification('Failed to join game', 1000)
}

const onNewOnlineGameSuccess = function () {
  notificationMessage('')
  $('#viewGameMessage').text('')
  $('#currentGameId').text('Current Game Id: ' + store.game.id)
}

const onNewOnlineGameFailure = function (response) {
  redNotification('Failed to start online game', 1000)
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
  redNotification('Failed to view game', 1000)
}

const onOnlineTimeout = function () {
  notificationMessage('Game timed out')
}

module.exports = {
  signInToPlay,
  startNewGameToPlay,
  onlineWaitForOtherPlayer,
  onlineNotYourTurn,
  joiningAnotherGame,
  otherPlayerJoined,
  gameIsOver,
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
