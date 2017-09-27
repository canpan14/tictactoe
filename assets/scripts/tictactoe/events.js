'use strict'

const controller = require('./controller')
const api = require('./api')
const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')

const onBoardClick = function (event) {
  controller.takeTurn(event)
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
