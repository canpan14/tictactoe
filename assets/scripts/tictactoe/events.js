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
    ui.startNewGameToPlay()
    return
  }
  // Ignore click not on a cell
  if (event.target.id === 'gameBoard') {
    return
  }
  if (controller.isGameOver()) {
    ui.gameIsOver()
    return
  }
  // Ignore click on cell with data in it
  if (event.target.innerHTML) {
    return
  }
  if (!controller.takeTurn(event)) return // Don't update on illegal move
  onUpdateGame(controller.getRecentMove())
    .then(() => {
      if (controller.isGameOver()) {
        onGetGamesForUser()
        closeGameWatcher()
      }
    })
}

const onSignIn = function (event) {
  event.preventDefault()
  const formData = getFormFields(event.target)
  api.signIn(formData)
    .then(ui.onSignInSuccess)
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
  ui.clearSignInForm(event)
}

const onSignInHide = function (event) {
  ui.clearSignUpForm(event)
  $('#badLoginAttempt').text('')
}

const onSignOut = function (event) {
  event.preventDefault()
  api.signOut()
    .then(ui.onSignOutSuccess)
    .then(closeGameWatcher)
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
  ui.clearChangePasswordForm(event)
}

const onNewOfflineGame = function () {
  return api.newGame()
    .then(ui.onNewOfflineGameSuccess)
    .then(closeGameWatcher)
    .then(controller.newOfflineGame)
    .catch(ui.onNewOfflineGameFailure)
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
  api.joinGame(event.target.form[0].value)
    .then(ui.onJoinGameSuccess)
    .then(closeGameWatcher)
    .then(controller.newOnlineGame)
    .then(() => {
      createWatcher(event.target.form[0].value)
    })
    .then(() => {
      controller.joinExisitingGame(store.game.player_x.id)
    })
    .then(() => {
      ui.joiningAnotherGame()
    })
    .catch(ui.onJoinGameFailure)
}

const createWatcher = function (gameId) {
  gameWatcher = rW.resourceWatcher(config.apiOrigin + '/games/' + gameId + '/watch',
    {
      Authorization: 'Token token=' + store.user.token,
      timeout: 60
    })
  gameWatcher.on('change', onMultiplayerUpdate)
}

const onShowGame = function (event) {
  event.preventDefault()
  api.showGame(event.target.form[0].value)
    .then((response) => {
      controller.setGameOver(true)
      return response
    })
    .then(ui.onShowGameSuccess)
    .then(closeGameWatcher)
    .catch(ui.onShowGameFailure)
}

const onNewOnlineGame = function (event) {
  onNewOfflineGame()
    .then(ui.onNewOnlineGameSuccess)
    .then(closeGameWatcher)
    .then(controller.newOnlineGame)
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
      // Added because watcher was getting it's own change reflected back at
      // itself when the other user updated based off the change sent out.
      const currentBoard = gameBoard.get1DBoard()
      for (let i = 0; i < currentBoard.length; i++) {
        let currentBoardAtI = ''
        if (!!currentBoard[i] === true) {
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
      ui.otherPlayerJoined()
    }
  } else if (data.timeout) { // not an error
    gameWatcher.close()
    controller.setGameOver(true)
    ui.onOnlineTimeout()
  }
}

const closeGameWatcher = function () {
  if (gameWatcher) {
    gameWatcher.close()
  }
}

const registerHandlers = function () {
  $('#gameBoard').on('mouseup', onBoardClick)
  $('#signIn').on('submit', onSignIn)
  $('#signUp').on('submit', onSignUp)
  $('#signUpModal').on('hidden.bs.modal', onSignUpHide)
  $('#signInModal').on('hidden.bs.modal', onSignInHide)
  $('#changePasswordModal').on('hidden.bs.modal', onChangePasswordHide)
  $('#signOut').on('click', onSignOut)
  $('#changePassword').on('submit', onChangePassword)
  $('#newGame').on('click', onNewOfflineGame)
  $('#newOnlineGame').on('click', onNewOnlineGame)
  $('#joinGameButton').on('click', onJoinGame)
  $('#viewGameButton').on('click', onShowGame)
}

module.exports = {
  registerHandlers,
  onBoardClick,
  onUpdateGame
}
