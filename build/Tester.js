const { equal, ok } = require('assert');
let aqt = require('@rqt/aqt'); if (aqt && aqt.__esModule) aqt = aqt.default;
let erotic = require('erotic'); if (erotic && erotic.__esModule) erotic = erotic.default;
let deepEqual = require('@zoroaster/deep-equal'); if (deepEqual && deepEqual.__esModule) deepEqual = deepEqual.default;

               class Tester extends Promise {
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
     * @type {import('.').default}
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
      if (typeof code == 'string' && message) {
        equal(this.res.headers[code.toLowerCase()], message)
        return
      } else if (typeof code == 'string' && message === null) {
        const v = this.res.headers[code.toLowerCase()]
        if (v)
          throw new Error(`The response had header ${code}: ${v}`)
        return
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
 * @typedef {import('@rqt/aqt').AqtReturn} AqtReturn
 */


module.exports = Tester