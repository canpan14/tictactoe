'use strict'

const controller = require('./controller')
const api = require('./api')
const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')
const store = require('../store')
const config = require('../config')
const rW = require('./resource-watcher-0.1.0')

// Global
let gameWatcher

const onBoardClick = function (event) {
  // Can only play when logged in
  if (!store.user) {
    ui.loginToPlay()
    return
  }
  // Can only play after starting a new game
  if (!store.game.id) {
    return
  }
  controller.takeTurn(event)
  onUpdateGame(controller.getRecentMove())
    .then(() => {
      if (controller.isGameOver()) {
        onGetGamesForUser()
      }
    })
}

const onLogin = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  api.signIn(formData)
    .then(ui.onSignInSuccess)
    .then(ui.activateNewGameButtons)
    .then(controller.initializeGame())
    .then(() => onGetGamesForUser())
    .catch(ui.onSignInFailure)
}

const onSignUp = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  api.signUp(formData)
    .then(ui.onSignUpSuccess)
    .catch(ui.onSignUpFailure)
}

const onSignUpHide = function (event) {
  $(this).find('form')[0].reset()
  $('#signInError').text('')
}

const onSignOut = function (event) {
  event.preventDefault()
  api.signOut()
    .then(ui.onSignOutSuccess)
    .catch(ui.onSignOutFailure)
}

const onChangePassword = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  api.changePassword(formData)
    .then(ui.onChangePasswordSuccess)
    .catch(ui.onChangePasswordFailure)
}

const onChangePasswordHide = function (event) {
  $(this).find('form')[0].reset()
  $('#changePasswordError').text('')
}

const onResetGame = function (event) {
  controller.resetGame()
  onNewGame()
    .then(() => {
      onGetGamesForUser()
    })
}

const onNewGame = function () {
  return api.newGame()
    .then(ui.onNewGameSuccess)
    .catch(ui.onNewGameFailure)
}

const onUpdateGame = function (move) {
  return api.updateGame(move)
    .then(ui.onUpdateGameSuccess)
    .catch(ui.onUpdateGameFailure)
}

const onGetGamesForUser = function () {
  api.getGamesForUser()
    .then(ui.onGetGamesForUserSuccess)
    .catch(ui.onGetGamesForUserFailure)
}

const onJoinGame = function (event) {
  event.preventDefault()
  api.joinGame(event.target.id.value)
    .then(ui.onJoinGameSuccess)
    .then(() => {
      createWatcher(event.target.id.value)
    })
    .catch(ui.onJoinGameFailure)
}

const createWatcher = function (gameId) {
  gameWatcher = rW.resourceWatcher(config.apiOrigin + '/games/' + gameId + '/watch',
    {
      Authorization: 'Token token=' + store.user.token,
      timeout: 120
    })
  gameWatcher.on('change', onMultiplayerUpdate)
}

const onNewOnlineGame = function (event) {
  console.log('Starting New Online Game')
  onNewGame()
    .then(ui.onNewOnlineGameSuccess)
    .then(() => {
      createWatcher(store.game.id)
    })
    .catch(ui.onNewOnlineGameFailure)
}

const onMultiplayerUpdate = function (event) {
  console.log('Multiplayer Update!')
  console.log(event)
}

const registerHandlers = function () {
  $('#gameBoard').on('mouseup', onBoardClick)
  $('#loginContainer').on('submit', onLogin)
  $('#signUp').on('submit', onSignUp)
  $('#signUpModal').on('hidden.bs.modal', onSignUpHide)
  $('#signOut').on('click', onSignOut)
  $('#changePassword').on('submit', onChangePassword)
  $('#changePasswordModal').on('hidden.bs.modal', onChangePasswordHide)
  $('#newGame').on('click', onResetGame)
  $('#newOnlineGame').on('click', onNewOnlineGame)
  $('#multiplayerJoin').on('submit', onJoinGame)
}

module.exports = {
  registerHandlers,
  onBoardClick,
  onUpdateGame
}
