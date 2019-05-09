import { equal, ok } from 'assert'
import erotic from 'erotic'
import Tester from '../Tester'

export default class CookieTester extends Tester {
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
      equal(count, num, 'should set cookie ' + num + ' times')
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
      ok(cookie, 'should set cookie ' + name)
      equal(cookie.value, val,
        'should set cookie ' + name + ' to ' + val)
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
      ok(cookie, 'should set cookie ' + name)
      ok((attrib.toLowerCase() in cookie),
        'should set cookie with attribute ' + attrib)
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
      ok(cookie, 'should set cookie ' + name)
      ok((attrib.toLowerCase() in cookie),
        'should set cookie with attribute ' + attrib)
      equal(cookie[attrib.toLowerCase()], value,
        'should set cookie with attribute ' + attrib + ' set to ' + value)
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
      ok(cookie, 'should set cookie ' + name)
      ok(!(attrib.toLowerCase() in cookie),
        'should set cookie without attribute ' + attrib)
    }, e)
    return this
  }
}