'use strict'

const controller = require('./controller')
const api = require('./api')
const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')
const store = require('../store')
const config = require('../config')
const rW = require('./resource-watcher-0.1.0')
const gameBoard = require('./gameBoard')

// Global
let gameWatcher

const onBoardClick = function (event) {
  // Can only play when logged in
  if (!store.user) {
    ui.loginToPlay()
    return
  }
  // Can only play after starting a new game
  if (!store.game) {
    return
  }
  // Ignore click not on a cell
  if (event.target.id === 'gameBoard') {
    return
  }
  // Ignore click on cell with data in it
  if (event.target.innerHTML) {
    return
  }
  // Check if it's a legal move
  if (!controller.isLegalMove(event)) {
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
    .then(controller.initializeGame)
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
    .then(controller.resetGame)
    .then(() => {
      createWatcher(event.target.id.value)
    })
    .then(() => {
      controller.joinExisitingGame(store.game.player_x.id)
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
  onNewGame()
    .then(ui.onNewOnlineGameSuccess)
    .then(controller.resetGame)
    .then(() => {
      createWatcher(store.game.id)
    })
    .then(() => {
      controller.setOnlineGame(true)
    })
    .catch(ui.onNewOnlineGameFailure)
}

const onMultiplayerUpdate = function (data) {
  if (data.game && data.game.cells) {
    const diff = changes => {
      const before = changes[0]
      const after = changes[1]
      // Check if after and current board are the same and ignore if they are,
      const currentBoard = gameBoard.get1DBoard()
      for (let i = 0; i < currentBoard.length; i++) {
        let currentBoardAtI = ''
        if (currentBoard[i] !== 0) {
          currentBoardAtI = currentBoard[i].boardMarker.toLowerCase()
        }
        if (currentBoardAtI !== after[i]) {
          for (let i = 0; i < after.length; i++) {
            if (before[i] !== after[i]) {
              return {
                index: i,
                value: after[i]
              }
            }
          }
        }
      }
      return false
    }

    const cell = diff(data.game.cells)
    if (cell !== false) {
      controller.otherPlayerUpdate(cell)
    }
  } else if (data.game) {
    if (data.game.player_o_id) {
      controller.otherPlayerJoin(data.game.player_o_id[1])
    }
  } else if (data.timeout) { // not an error
    gameWatcher.close()
  }
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
