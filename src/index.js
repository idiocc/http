import { debuglog } from 'util'

const LOG = debuglog('@idio/http')

/**
 * The Http(s) Testing Context For Super-Test Style Assertions. Includes Standard Assertions (get, set, assert), And Allows To Be Extended With JSDocumented Custom Assertions.
 * @param {_@idio/http.Config} [config] Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} config.text A text to return.
 */
export default async function http(config = {}) {
  const {
    shouldRun = true,
    text,
  } = config
  if (!shouldRun) return
  LOG('@idio/http called with %s', text)
  return text
}

/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_@idio/http.Config} Config Options for the program.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _@idio/http.Config Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} text A text to return.
 */
