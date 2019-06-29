const { c } = require('erte');
const mistmatch = require('mismatch');

/**
 * Creates the was expected error.
 * @param {string} type The type
 * @param {string} name The name
 * @param {string} [val] Optionally expected value.
 * @example
```js
Error: Cookie example was expected:
  - test
```
 */
const wasExpectedError = (type, name, val) => {
  const we = `${type} ${c(name, 'blue')} was expected`
  const v = val ? `:
${compare(undefined, val)}` : '.'
  return `${we}${v}`
}
const wasNotExpected = (type, name, val) => {
  return `${type} ${name ? c(name, 'blue') + ' ' : ''}was not expected:
  ${c(`+ ${val}`, 'green')}`
}

const didNotMatchValue = (type, name, val, actual) => {
  return `${type} ${name ? c(name, 'blue') + ' ' : ''}did not match value:
${compare(actual, val)}`
}

const compare = (actual, expected) => {
  const ar = []
  if (expected !== undefined) ar.push(`${c(`- ${expected}`, 'red')}`)
  if (actual !== undefined) ar.push(`${c(`+ ${actual}`, 'green')}`)
  return ar.join('\n')
}

/**
 * Parses the `set-cookie` header.
 * @param {string} header
 */
function parseSetCookie(header) {
  const pattern = /\s*([^=;]+)(?:=([^;]*);?|;|$)/g

  const pairs = mistmatch(pattern, header, ['name', 'value'])

  /** @type {{ name: string, value: string }} */
  const cookie = pairs.shift()

  for (let i = 0; i < pairs.length; i++) {
    const match = pairs[i]
    cookie[match.name.toLowerCase()] = (match.value || true)
  }

  return cookie
}

module.exports.wasExpectedError = wasExpectedError
module.exports.wasNotExpected = wasNotExpected
module.exports.didNotMatchValue = didNotMatchValue
module.exports.compare = compare
module.exports.parseSetCookie = parseSetCookie