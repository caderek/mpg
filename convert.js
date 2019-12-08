/**
 * @typedef {Object} BufferSize
 * @property {number} whole
 * @property {number} fraction
 */

/**
 * Splits number into single-digit chunks,
 * with whole and fraction parts separated.
 *
 * @param {number | string} num Any number, can be in a string form
 * @returns {[number[], number[]]} A tuple with whole and fraction digits
 *
 * @example
 *
 * const input = 123.456
 * const [whole, fraction] = splitToDigits(input)
 *
 * console.log(whole) // -> [1, 2, 3]
 * console.log(fraction) // -> [4, 5, 6]
 */
const splitToDigits = (num) => {
  const [wholePart, fractionPart] = (typeof num === "string"
    ? num
    : String(num)
  ).split(".")

  return [
    wholePart ? wholePart.split("").map((x) => Number(x)) : [],
    fractionPart ? fractionPart.split("").map((x) => Number(x)) : [],
  ]
}

/**
 * Calculates required buffer size to fit all operations.
 *
 * @param {number} margin
 * @param  {Array<[number[], number[]]>} numbersAsDigits
 * @returns
 */
const calculateRequiredBufferSize = (margin, precision, numbersAsDigits) => {
  const lengths = [precision, ...numbersAsDigits.map((x) => x[0].length)]
  return Math.max(...lengths) + margin
}

/**
 * Creates a typed array that represents a number.
 *
 * @param {[number[], number[]]} digits A tuple with whole and fraction digits
 * @param {BufferSize} bufferSize An object containing buffer size setup
 * @returns {Int8Array} A typed array of raw bytes representing a number
 *
 * @example
 *
 * const digits = [[1, 2, 3], [4, 5, 6]]
 * const bufferSize = { whole: 5, fraction: 7 }
 * const digitsAsTypedArray = toTypedArray(digits, bufferSize)
 *
 * console.log(digitsAsTypedArray)
 *
 * ---
 * Result:
 *
 * Int8Array [ 0, 0, 1, 2, 3, 4, 5, 6, 0, 0, 0, 0 ]
 *
 *           |     whole    |      fraction       |
 */
const toTypedArray = (digits, bufferSize) => {
  const [whole, fraction] = digits
  const num = new Int8Array(
    new SharedArrayBuffer(bufferSize.whole + bufferSize.fraction),
  )

  for (let i = 0; i < whole.length; i++) {
    num[bufferSize.whole - (whole.length - i)] = whole[i]
  }

  for (let i = 0; i < fraction.length; i++) {
    num[bufferSize.whole + i] = fraction[i]
  }

  return num
}

/**
 * Adds two typed arrays.
 *
 * @param {Int8Array} a summand
 * @param {Int8Array} b summand
 * @returns {Int8Array} sum
 */
const add = (a, b) => {
  let rest = 0
  const sum = new Int8Array(a.length)

  for (let i = a.length - 1; i >= 0; i--) {
    const subSum = a[i] + b[i] + rest
    rest = subSum < 10 ? 0 : 1
    sum[i] = subSum < 10 ? subSum : subSum - 10
  }

  return sum
}

/**
 * Subtracts two typed arrays.
 *
 * @param {Int8Array} a subtrahend
 * @param {Int8Array} b minuend
 * @returns {Int8Array} difference
 */
const subtract = (a, b) => {
  let rest = 0
  const diff = new Int8Array(a.length)

  for (let i = a.length - 1; i >= 0; i--) {
    const x = a[i] + rest
    const isAGreaterOrEqualB = x >= b[i]
    const subDiff = isAGreaterOrEqualB ? x - b[i] : x + 10 - b[i]
    rest = isAGreaterOrEqualB ? 0 : -1
    diff[i] = subDiff
  }

  return diff
}

/**
 * Multiplies two typed arrays.
 *
 * @param {Int8Array} a factor
 * @param {Int8Array} b factor
 * @returns {Int8Array} product
 */
const multiply = (a, b, fractionSize) => {
  let rest = 0
  const temp = []

  for (let i = b.length - 1; i >= 0; i--) {
    let shift = fractionSize--
    const partial = new Int8Array(a.length)
    for (let j = a.length - 1; j >= 0; j--) {
      const subProduct = b[i] * a[j] + rest
      rest = (subProduct / 10) >>> 0
      partial[j + shift] = subProduct % 10
    }
    temp.push(partial)
  }

  return temp.reduce(add, new Int8Array(a.length))
}

/**
 * Checks if one typed array is greater than the other one.
 *
 * @param {Int8Array} a
 * @param {Int8Array} b
 */
const isGreater = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) {
      return true
    }
  }
  return false
}

/**
 * Checks if two typed arrays are equal.
 *
 * @param {Int8Array} a
 * @param {Int8Array} b
 */
const isEqual = (a, b) => a.join() === b.join()

/**
 * Divides two typed arrays.
 *
 * @param {Int8Array} a dividend
 * @param {Int8Array} b divisor
 * @returns {Int8Array} quotient
 */
const divide = (a, b, fractionSize) => {
  if (isEqual(a, b)) {
    const result = new Int8Array(a.length)
    result[result.length - fractionSize - 1] = 1
    return result
  }

  let result = new Int8Array(a.length)
  let temp = new Int8Array(a.length)
  const one = new Int8Array(a.length).fill(1, -1)
  const max = new Int8Array(a.length).fill(9)

  while (!isEqual(temp, max)) {
    const product = multiply(temp, b, fractionSize)

    if (isEqual(product, a)) {
      return temp
    }

    if (!isGreater(a, product)) {
      break
    }

    result = temp.slice(0)
    temp = add(temp, one)
  }

  return result
}

/**
 * Converts typed array of digits to a string that represent final result
 * - a big number without leading and ending zeros.
 *
 * @param {Int8Array} typedArr A typed array of raw bytes representing a number
 * @param {BufferSize} bufferSize An object containing buffer size setup
 * @returns {string} Formatted output
 */
const formatOutput = (typedArr, bufferSize) => {
  const arr = [...typedArr]
  const whole = arr
    .slice(0, bufferSize.whole)
    .join("")
    .replace(/^0+/, "")
    .replace(/^$/, "0")
  const fraction = arr
    .slice(bufferSize.whole)
    .join("")
    .replace(/0+$/, "")

  return fraction ? `${whole}.${fraction}` : whole
}

/* SOLUTION */

const defaultPrecision = 3
const input = process.argv[2]
const precision =
  process.argv[3] === undefined ? defaultPrecision : Number(process.argv[3])
const litersPerGallon = 3.785411784 * 100
const kilometersPerMile = 1.609344

const litersPerGallonAsDigits = splitToDigits(litersPerGallon)
const kilometersPerMileAsDigits = splitToDigits(kilometersPerMile)

/** Buffer margin to fit all calculations */
const margin = 3

/**
 * Converts mpg to l/100km and vice versa.
 *
 * @param {string | number} input Arbitrary precision number
 * @param {number} precision Result precision
 * @returns {string} conversion result
 */
const convert = (input, precision = 3) => {
  const inputAsDigits = splitToDigits(input)

  const bufferSize = {
    whole: calculateRequiredBufferSize(margin, precision, [
      litersPerGallonAsDigits,
      kilometersPerMileAsDigits,
      inputAsDigits,
    ]),
    fraction: precision,
  }

  const conversionFactor = divide(
    toTypedArray(litersPerGallonAsDigits, bufferSize),
    toTypedArray(kilometersPerMileAsDigits, bufferSize),
    bufferSize.fraction,
  )

  const result = divide(
    conversionFactor,
    toTypedArray(inputAsDigits, bufferSize),
    bufferSize.fraction,
  )

  return formatOutput(result, bufferSize)
}

console.log(convert(input, precision))

module.exports = {
  splitToDigits,
  calculateRequiredBufferSize,
  toTypedArray,
  add,
  subtract,
  multiply,
  divide,
  formatOutput,
  convert,
}
