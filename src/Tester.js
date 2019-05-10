import { equal, ok } from 'assert'
import aqt from '@rqt/aqt'
import erotic from 'erotic'
import { c } from 'erte'
import deepEqual from '@zoroaster/deep-equal'

export default class Tester extends Promise {
  constructor() {
    super(() => {})
    /**
     * The headers to send with the request, must be set before the `get` method is called using the `set` method.
     * @type {http.OutgoingHttpHeaders}
     */
    this.headers = {}

    /**
     * @private
     */
    this._chain = Promise.resolve(true)
    /**
     * The reference to the parent context that started the server.
     * @type {import('./Http').default}
     */
    this.context = null
    /**
     * The response saved after requests.
     * @type {import('@rqt/aqt').AqtReturn}
     */
    this.res = null
  }
  /**
   * Adds the action to the list.
   * @private
   */
  _addLink(fn, e) {
    this._chain = this._chain.then(async (res) => {
      if (res === false) return false
      try {
        return await fn()
      } catch (err) {
        if (e) throw e(err)
        throw err
      }
    })
  }
  /**
   * @private
   */
  then(Ok, notOk) {
    return this._chain.then(() => {
      Ok()
    }, (err) => {
      notOk(err)
    })
  }
  /**
   * Navigate to the path and store the result status code, body and headers in an internal state.
   * @param {string} path The path to navigate, empty by default.
   */
  get(path = '') {
    this._addLink(async () => {
      const res = await aqt(`${this.url}${path}`, {
        headers: this.headers,
      })
      this.res = res
    })
    return this
  }
  /**
   * Send `HEAD` request to the server.
   * @param {string} path The path to navigate, empty by default.
   */
  head(path = '') {
    this._addLink(async () => {
      const res = await aqt(`${this.url}${path}`, {
        headers: this.headers,
        method: 'HEAD',
      })
      this.res = res
    })
    return this
  }
  /**
   * Assert on the status code and body when a number is given.
   * Assert on the header when the string is given. If the second arg is null, asserts on the absence of the header.
   * @param {number|string|function(AqtReturn)} code The number of the status code, or name of the header, or the custom assertion function.
   * @param {String} message The body or header value (or null for no header).
   */
  assert(code, message) {
    const e = erotic(true)
    this._addLink(() => {
      if (typeof code == 'function') {
        code(this.res)
        return
      }
      if (typeof code == 'string') {
        const header = this.res.headers[code.toLowerCase()]
        if (message instanceof RegExp) {
          ok(message.test(header), `Header ${c(code, 'blue')} did not match RexExp:
  ${c(`- ${message}`, 'red')}
  ${c(`+ ${header}`, 'green')}`)
          return
        } else if (message) {
          equal(header, message, `Header ${c(code, 'blue')} did not match value:
  ${c(`- ${message}`, 'red')}
  ${c(`+ ${header}`, 'green')}`)
          return
        } else if (message === null) {
          if (header)
            throw new Error(`Header ${c(code, 'blue')} was not expected:
  ${c(`+ ${header}`, 'green')}`)
          else return
        }
        throw new Error('Nothing was tested')
      }
      // if we're here means code assertion
      try {
        equal(this.res.statusCode, code)
      } catch (err) {
        err.message = err.message + ' ' + this.res.body || ''
        throw err
      }
      if (message instanceof RegExp) {
        ok(message.test(this.res.body), `The body does not match ${message}`)
      } else if (typeof message == 'object') {
        deepEqual(this.res.body, message)
      } else if (message) equal(this.res.body, message)
    }, e)
    return this
  }
  /**
   * Sets the value for the header in the upcoming request.
   * @param {string} name The name of the header to set.
   * @param {string} value The value to set.
   */
  set(name, value) {
    this.headers[name] = value
    return this
  }
}

/**
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 * @typedef {import('./').AqtReturn} AqtReturn
 */