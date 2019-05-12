import { equal, ok } from 'assert'
import erotic from 'erotic'
import { c } from 'erte'
import { Tester } from '../'
import { wasExpectedError, didNotMatchValue, wasNotExpected } from '../lib'

const assertAttribute = (name, cookie, attrib) => {
  ok(cookie, wasExpectedError('Cookie', name))
  ok((attrib.toLowerCase() in cookie),
    `Attribute ${c(attrib, 'blue')} of cookie ${c(name, 'yellow')} was expected.`)
}

export default class CookiesTester extends Tester {
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