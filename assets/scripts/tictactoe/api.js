'use strict'

const config = require('../config')

const signUp = function (formData) {
  return $.ajax({
    url: config.apiOrigin + '/sign-up',
    method: 'POST',
    data: formData
  })
}

module.exports = {
  signUp
}
