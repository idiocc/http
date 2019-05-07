import { equal, ok } from 'assert'
import aqt from '@rqt/aqt'
import erotic from 'erotic'
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
     * @type {import(.).default}
     */
    this.context = null
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
      const { statusCode, body, headers } = await aqt(`${this.url}${path}`, {
        headers: this.headers,
      })
      this.statusCode = statusCode
      this.body = body
      this.context.response.headers = headers
    })
    return this
  }
  /**
   * Assert on the status code and body when a number is given.
   * Assert on the header when the string is given. If the second arg is null, asserts on the absence of the header.
   * @param {number|string|function(Response)} code The number of the status code, or name of the header, or the custom assertion function.
   * @param {String} message The body or header value (or null for no header).
   */
  assert(code, message) {
    const e = erotic(true)
    this._addLink(() => {
      if (typeof code == 'function') {
        code(this.context.response)
        return
      }
      if (typeof code == 'string' && message) {
        equal(this.context.response.headers[code.toLowerCase()], message)
        return
      } else if (typeof code == 'string' && message === null) {
        const v = this.context.response.headers[code.toLowerCase()]
        if (v)
          throw new Error(`The response had header ${code}: ${v}`)
        return
      }
      // if we're here means code assertion
      try {
        equal(this.statusCode, code)
      } catch (err) {
        err.message = err.message + ' ' + this.body || ''
        throw err
      }
      if (message instanceof RegExp) {
        ok(message.test(this.body), `The body does not match ${message}`)
      } else if (typeof message == 'object') {
        deepEqual(this.body, message)
      } else if (message) equal(this.body, message)
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
 * @typedef {import('.').Response} Response
 */
