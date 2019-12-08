const {
  add,
  subtract,
  multiply,
  divide,
  convert,
  formatOutput,
} = require("./convert")

describe("add", () => {
  it("1 + 1 = 2", () => {
    const result = add(new Int8Array([1]), new Int8Array([1]))
    const output = formatOutput(result, { whole: 1, fraction: 0 })

    expect(output).toBe("2")
  })

  it("1.25 + 1.25 = 2.5", () => {
    const result = add(new Int8Array([1, 2, 5]), new Int8Array([1, 2, 5]))
    const output = formatOutput(result, { whole: 1, fraction: 2 })

    expect(output).toBe("2.5")
  })

  it("99.99 + 99.99 = 199.98", () => {
    const result = add(
      new Int8Array([0, 9, 9, 9, 9]),
      new Int8Array([0, 9, 9, 9, 9]),
    )
    const output = formatOutput(result, { whole: 3, fraction: 5 })

    expect(output).toBe("199.98")
  })

  it("12345.6789 + 92345.6789 = 104691.3578", () => {
    const result = add(
      new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      new Int8Array([0, 9, 2, 3, 4, 5, 6, 7, 8, 9]),
    )
    const output = formatOutput(result, { whole: 6, fraction: 4 })

    expect(output).toBe("104691.3578")
  })
})

describe("subtract", () => {
  it("2 - 1 = 1", () => {
    const result = subtract(new Int8Array([2]), new Int8Array([1]))
    const output = formatOutput(result, { whole: 1, fraction: 0 })

    expect(output).toBe("1")
  })

  it("5.75 - 1.25 = 4.5", () => {
    const result = subtract(new Int8Array([5, 7, 5]), new Int8Array([1, 2, 5]))
    const output = formatOutput(result, { whole: 1, fraction: 2 })

    expect(output).toBe("4.5")
  })

  it("2.25 - 1.5 = 0.75", () => {
    const result = subtract(new Int8Array([2, 2, 5]), new Int8Array([1, 5, 0]))
    const output = formatOutput(result, { whole: 1, fraction: 2 })

    expect(output).toBe("0.75")
  })

  it("92345.2345 - 12345.6789 = 79999.5556", () => {
    const result = subtract(
      new Int8Array([0, 9, 2, 3, 4, 5, 2, 3, 4, 5]),
      new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    )
    const output = formatOutput(result, { whole: 6, fraction: 4 })

    expect(output).toBe("79999.5556")
  })
})

describe("multiply", () => {
  it("1 * 1 = 2", () => {
    const result = multiply(new Int8Array([1]), new Int8Array([1]), 0)
    const output = formatOutput(result, { whole: 1, fraction: 0 })

    expect(output).toBe("1")
  })

  it("8 * 7 = 56", () => {
    const result = multiply(new Int8Array([0, 8]), new Int8Array([0, 7]), 0)
    const output = formatOutput(result, { whole: 2, fraction: 0 })

    expect(output).toBe("56")
  })

  it("1.25 * 3.5 = 4.375", () => {
    const result = multiply(
      new Int8Array([0, 1, 2, 5, 0]),
      new Int8Array([0, 3, 5, 0, 0]),
      3,
    )
    const output = formatOutput(result, { whole: 2, fraction: 3 })

    expect(output).toBe("4.375")
  })

  it("99.1234 * 6.0012 = 594.8593(4804 cut)", () => {
    const result = multiply(
      new Int8Array([0, 9, 9, 1, 2, 3, 4]),
      new Int8Array([0, 0, 6, 0, 0, 1, 2]),
      4,
    )
    const output = formatOutput(result, { whole: 3, fraction: 4 })

    expect(output).toBe("594.8593")
  })
})

describe("divide", () => {
  it("2 / 2 = 1", () => {
    const result = divide(new Int8Array([2]), new Int8Array([2]), 0)
    const output = formatOutput(result, { whole: 1, fraction: 0 })

    expect(output).toBe("1")
  })
  it("999.99 / 999.99 = 1", () => {
    const result = divide(
      new Int8Array([9, 9, 9, 9, 9]),
      new Int8Array([9, 9, 9, 9, 9]),
      2,
    )
    const output = formatOutput(result, { whole: 3, fraction: 2 })

    expect(output).toBe("1")
  })

  it("2 / 1 = 2", () => {
    const result = divide(new Int8Array([2]), new Int8Array([1]), 0)
    const output = formatOutput(result, { whole: 1, fraction: 0 })

    expect(output).toBe("2")
  })

  it("15 / 5 = 3", () => {
    const result = divide(new Int8Array([1, 5]), new Int8Array([0, 5]), 0)
    const output = formatOutput(result, { whole: 2, fraction: 0 })

    expect(output).toBe("3")
  })

  it("5 / 15 = 0", () => {
    const result = divide(new Int8Array([0, 5]), new Int8Array([1, 5]), 0)
    const output = formatOutput(result, { whole: 2, fraction: 0 })

    expect(output).toBe("0")
  })

  it("5 / 15 = 0.3333 (precision 4)", () => {
    const result = divide(
      new Int8Array([0, 5, 0, 0, 0, 0]),
      new Int8Array([1, 5, 0, 0, 0, 0]),
      4,
    )
    const output = formatOutput(result, { whole: 2, fraction: 4 })

    expect(output).toBe("0.3333")
  })

  it("378.54 / 1.60 = 236.5875", () => {
    const result = divide(
      new Int8Array([0, 3, 7, 8, 5, 4, 0, 0]),
      new Int8Array([0, 0, 0, 1, 6, 0, 0, 0]),
      4,
    )
    const output = formatOutput(result, { whole: 4, fraction: 4 })

    expect(output).toBe("236.5875")
  })
})

it("works", () => {
  expect(convert("123")).toBe("1.912")
})
