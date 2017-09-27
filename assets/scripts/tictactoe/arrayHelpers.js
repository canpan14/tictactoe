'use strict'

// https://stackoverflow.com/questions/22464605/convert-a-1d-array-to-2d-array
/**
 * Takes in 1D (Divisible by 3) array and returns a 2D array (3 by 3)
 * @param  {array} arr 1D array with length 9
 * @return {array}     2D array with dimensions 3 by 3
 */
const convertArray1Dto2D = function (arr) {
  const newArr = []
  while (arr.length) newArr.push(arr.splice(0, 3))
  return newArr
}

/**
 * Takes in 2D (3 by 3) array and returns a 1D array (length 9)
 * @param  {array} arr 2D array with dimensions 3 by 3
 * @return {array}     1D array with length 9
 */
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
