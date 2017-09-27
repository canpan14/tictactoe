'use strict'

// https://stackoverflow.com/questions/22464605/convert-a-1d-array-to-2d-array
// Takes in 1D array returns new 2D array (9 length to 3 by 3)
const convertArray1Dto2D = function (arr) {
  const newArr = []
  while (arr.length) newArr.push(arr.splice(0, 3))
  return newArr
}

// Takes in 2D array returns 1D array (3 by 3 to 9 length)
const convertArray2Dto1D = function (arr) {
  const newArr = arr.reduce((a, b) => {
    a.concat(b)
  })
  return newArr
}

module.exports = {
  convertArray1Dto2D,
  convertArray2Dto1D
}
