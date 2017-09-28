'use strict'

const Move = function () {
  this.index = null
  this.value = null
  this.isEndsGame = null
}

const createMove = function () {
  return new Move()
}

module.exports = {
  createMove
}
