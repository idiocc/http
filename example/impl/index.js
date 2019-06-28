import Http from '../../'
import CookiesTester from './tester'
import mistmatch from 'mismatch'

/**
 * Extends _HTTPContext_ to assert on the cookies.
 */
export default class Cookies extends Http {
  constructor() {
    super()
    this.TesterConstructor = CookiesTester
    /**
     * Parsed cookies.
     * @private
     */
    this._cookies = null
  }
  /**
   * Creates a server and wraps the supplied listener in the handler that will
   * set status code `500` if the listener threw and the body to the error text.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn
   * @param {boolean} secure
   */
  start(fn, secure) {
    const tester = /** @type {CookiesTester} */ (super.start(fn, secure))
    return tester
  }
  /**
   * Creates a server with the supplied listener.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn
   * @param {boolean} secure
   */
  startPlain(fn, secure) {
    const tester = /** @type {CookiesTester} */ (super.startPlain(fn, secure))
    return tester
  }
  getCookies() {
    if (this._cookies) return this._cookies
    const setCookies = /** @type {Array<string>} */
      (this.tester.res.headers['set-cookie']) || []
    const res = setCookies.map(Cookies.parseSetCookie)
    this._cookies = res
    return res
  }
  /**
   * Parses the `set-cookie` header.
   * @param {string} header
   */
  static parseSetCookie(header) {
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
  _reset() {
    super._reset()
    this._cookies = null
  }
}