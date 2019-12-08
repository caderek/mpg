# MPG <=> L/100km Converter

## Description

Deliberately over-engineered, arbitrary-precision MPG <=> L/100km Converter ;)
Slow and useless!

## Requirements

Node.js -> [download](https://nodejs.org/en/download/)

## How to run

Inside a folder with the script:

```
node convert <value> [precision]
```

Examples:

```js
// With default precision = 3 (result: 117.632)
node convert 2

// With custom precision (result: 78.92)
node convert 3 2
```

_**Note: Do not use big numbers and big precisions, script is not optimized at all and is very slow ;)**_

## License

ISC
