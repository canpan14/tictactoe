'use strict'

// Player contructor
const Player = function (id, name, boardMarker) {
  this.id = id
  this.name = name
  this.boardMarker = boardMarker
}

const createPlayer = function (id, name, boardMarker) {
  return new Player(id, name, boardMarker)
}

module.exports = {
  createPlayer
}
