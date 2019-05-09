import Http from '../Http'
import CookieTester from './Tester'
import mistmatch from 'mismatch'

export default class Cookies extends Http {
  constructor() {
    super()
    this.TesterConstructor = CookieTester
  }
  /**
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn
   * @param {boolean} secure
   */
  start(fn, secure) {
    const tester = /** @type {CookieTester} */ (super.start(fn, secure))
    return tester
  }
  getCookies() {
    const setCookies = /** @type {Array<string>} */
      (this.tester.res.headers['set-cookie']) || []
    return setCookies.map(Cookies.parseSetCookie)
  }
  /**
   * Parses the `set-cookie` header.
   * @param {string} header
   */
  static parseSetCookie(header) {
    const pattern = /\s*([^=;]+)(?:=([^;]*);?|;|$)/g

    const pairs = mistmatch(pattern, header, ['name', 'value'])

    const cookie = pairs.shift()

    for (let i = 0; i < pairs.length; i++) {
      const match = pairs[i]
      cookie[match.name.toLowerCase()] = (match.value || true)
    }

    return cookie
  }
  /**
   * Returns the cookie record for the given name.
   * @param {string} name
   */
  getCookieForName(name) {
    const cookies = this.getCookies()

    return cookies.find(({ name: n }) => {
      return name == n
    })
  }
}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */