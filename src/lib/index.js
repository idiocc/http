import { c } from 'erte'
import mistmatch from 'mismatch'

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

/**
 * Parses the `set-cookie` header.
 * @param {string} header
 */
export function parseSetCookie(header) {
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