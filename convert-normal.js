// @ts-nocheck
const BigNumber = require("bignumber.js")

const litersInGallon = new BigNumber(3.785411784)
const kilometersInMile = new BigNumber(1.609344)
const conversionFactor = new BigNumber(100)
  .times(litersInGallon)
  .dividedBy(kilometersInMile)

const convertNormal = (data) => conversionFactor.dividedBy(data).toString()

module.exports = convertNormal
