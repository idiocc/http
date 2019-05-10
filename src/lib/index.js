import { c } from 'erte'

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
export const wasExpectedError = (type, name, val) => {
  const we = `${type} ${c(name, 'blue')} was expected`
  const v = val ? `:
${compare(undefined, val)}` : '.'
  return `${we}${v}`
}
export const wasNotExpected = (type, name, val) => {
  return `${type} ${name ? c(name, 'blue') + ' ' : ''}was not expected:
  ${c(`+ ${val}`, 'green')}`
}

export const didNotMatchValue = (type, name, val, actual) => {
  return `${type} ${name ? c(name, 'blue') + ' ' : ''}did not match value:
${compare(actual, val)}`
}

export const compare = (actual, expected) => {
  const ar = []
  if (expected !== undefined) ar.push(`${c(`- ${expected}`, 'red')}`)
  if (actual !== undefined) ar.push(`${c(`+ ${actual}`, 'green')}`)
  return ar.join('\n')
}