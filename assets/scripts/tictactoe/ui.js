'use strict'

const onTurnChange = function (currentPlayer) {
  $('#playerTurnText').text(currentPlayer.name + '\'s turn')
}

module.exports = {
  onTurnChange
}
