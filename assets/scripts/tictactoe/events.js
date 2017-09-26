'use strict'

const game = require('../main')
const api = require('./api')
const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')

const onBoardClick = function (event) {
  // If gameover or cell is already filled, ignore
  if (game.isGameOver() || event.target.innerHTML) {
    return
  }
  game.takeTurn(event)
}

const onLogin = function (event) {
  // Login logic
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

const registerHandlers = function () {
  $('#gameBoard').on('mouseup', onBoardClick)
  $('#login').on('submit', onLogin)
  $('#signUp').on('submit', onSignUp)
  $('#signUpModal').on('hidden.bs.modal', onSignUpHide)
}

module.exports = {
  registerHandlers,
  onBoardClick
}
