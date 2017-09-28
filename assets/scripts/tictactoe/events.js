'use strict'

const controller = require('./controller')
const api = require('./api')
const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')
const store = require('../store')

const onBoardClick = function (event) {
  // Can only play when logged in
  if (!store.user) {
    ui.loginToPlay()
    return
  }
  if (controller.getTurnCounter() === 1) {
    onNewGame()
      .then(function () {
        controller.takeTurn(event)
        onUpdateGame(controller.getRecentMove())
      })
  } else {
    controller.takeTurn(event)
    onUpdateGame(controller.getRecentMove())
  }
}

const onLogin = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  api.signIn(formData)
    .then(ui.onSignInSuccess)
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
}

const onNewGame = function () {
  return api.newGame()
    .then(ui.onNewGameSuccess)
    .catch(ui.onNewGameFailure)
}

const onUpdateGame = function (move) {
  api.updateGame(move)
    .then(ui.onUpdateGameSuccess)
    .catch(ui.onUpdateGameFailure)
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
}

module.exports = {
  registerHandlers,
  onBoardClick,
  onUpdateGame
}
