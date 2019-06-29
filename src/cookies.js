import Http, { Tester } from './'
import { equal, ok } from 'assert'
import erotic from 'erotic'
import { c } from 'erte'
import { wasExpectedError, didNotMatchValue, wasNotExpected, parseSetCookie } from './lib'

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
   * Creates a server and wraps the supplied listener in the handler that will set status code `500` if the listener threw and the body to the error text.
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
    return parseSetCookie(header)
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

/**
 * The tester for assertion on cookies.
 */
export class CookiesTester extends Tester {
  constructor() {
    super()
    /** @type {import('.').default} */
    this.context = null
  }
  /**
   * Assert on the number of times the cookie was set.
   * @param {number} num The expected count.
   */
  count(num) {
    const e = erotic(true)
    this._addLink(() => {
      const count = this.context.getCookies().length
      equal(count, num, 'Should set cookie ' + num + ' times, not ' + count + '.')
    }, e)
    return this
  }

  /**
   * Asserts on the value of the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} val The value of the cookie.
   */
  value(name, val) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, wasExpectedError('Cookie', name, val))
      equal(cookie.value, val,
        didNotMatchValue('Cookie', name, val, cookie.value))
    }, e)
    return this
  }
  /**
   * Asserts on the presence of the cookie.
   * @param {string} name The name of the cookie.
   */
  name(name) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, wasExpectedError('Cookie', name))
    }, e)
    return this
  }

  /**
   * Asserts on the presence of an attribute in the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   */
  attribute(name, attrib) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      assertAttribute(name, cookie, attrib)
    }, e)
    return this
  }

  /**
   * Asserts on the value of the cookie's attribute.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   * @param {string} value The value of the attribute.
   */
  attributeAndValue(name, attrib, value) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      assertAttribute(name, cookie, attrib)
      const actual = cookie[attrib.toLowerCase()]
      equal(actual, value,
        didNotMatchValue(`Attribute ${c(attrib, 'blue')} of cookie ${c(name, 'yellow')}`,
          null, value, actual))
    }, e)
    return this
  }
  /**
   * Asserts on the absence of an attribute in the cookie.
   * @param {string} name The name of the cookie.
   * @param {string} attrib The name of the attribute.
   */
  noAttribute(name, attrib) {
    const e = erotic(true)
    this._addLink(() => {
      const cookie = this.context.getCookieForName(name)
      ok(cookie, wasExpectedError('Cookie', name))
      const a = attrib.toLowerCase()
      ok(!(a in cookie),
        wasNotExpected(`Attribute ${c(attrib, 'blue')} of cookie ${c(name, 'yellow')}`,
          null, cookie[a]))
    }, e)
    return this
  }
}

const assertAttribute = (name, cookie, attrib) => {
  ok(cookie, wasExpectedError('Cookie', name))
  ok((attrib.toLowerCase() in cookie),
    `Attribute ${c(attrib, 'blue')} of cookie ${c(name, 'yellow')} was expected.`)
}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {import('@rqt/aqt').AqtReturn} AqtReturn
 */