'use strict'

const game = require('../main.js')

const onBoardClick = function (event) {
  // If gameover or cell is already filled, ignore
  if (game.isGameOver() || event.target.innerHTML) {
    return
  }
  game.fillBox(event)
}

const registerHandlers = function () {
  $('#gameBoard').on('mouseup', onBoardClick)
}

module.exports = {
  registerHandlers,
  onBoardClick
}
