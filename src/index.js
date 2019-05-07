import { equal, ok } from 'assert'
import { createServer } from 'http'
import { join } from 'path'
import aqt from '@rqt/aqt'
import { createServer as createSecureServer } from 'https'
import { readFileSync } from 'fs'
import erotic from 'erotic'
import cleanStack from '@artdeco/clean-stack'
import deepEqual from '@zoroaster/deep-equal'
import { c } from 'erte'

const cert = readFileSync(join(__dirname, 'server.crt'), 'ascii')
const key = readFileSync(join(__dirname, 'server.key'), 'ascii')

export class Tester extends Promise {
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
     * @type {Server}
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
   * Navigate to the path and return the result.
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

export default class Server {
  constructor() {
    /**
     * The constructor for the tester that will be returned by the `start` method. Additional assertions can be implemented by extending the `Tester` class that comes with the server.
     */
    this.TesterConstructor = Tester
    /**
     * The HTTP(S) server will be set on the tester after the `start` method is called. It will be automatically destroyed by the end of the test.
     * @type {http.Server}
     */
    this.server = null
    /**
     * After the request listener is called, the `response` will be set to the server response which comes as the second argument to the request listener callback. The response will be updated to contain parsed headers.
     * @type {Response}
     */
    this.response = null
  }
  /**
   * Call to switch on printing of debug messages and error stacks in the response body.
   * @param {boolean} [on] Whether to switch on debugging. Default `true`.
   */
  debug(on = true) {
    this._debug = on
  }
  /**
   * Creates a server.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn The server callback. If it does not throw an error, the 200 status code is set.
   * @param {boolean} [secure=false] Whether to start an https server.
   */
  start(fn, secure = false) {
    let server
    const handler = async (req, res) => {
      try {
        this.response = res
        await fn(req, res)
        res.statusCode = 200
      } catch (err) {
        res.statusCode = 500
        res.write(err.message)
        if (this._debug) console.error(c(cleanStack(err.stack), 'yellow'))
      } finally {
        res.end()
      }
    }
    if (secure) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
      server = createSecureServer({ cert, key }, handler)
    } else {
      server = createServer(handler)
    }
    const tester = new this.TesterConstructor()
    tester._addLink(async () => {
      await new Promise(r => server.listen(r))
      if (this._destroyed) { // guard against errors in the test case
        server.close()
        return false
      }
      tester.server = server
      tester.url = `http${secure ? 's' : ''}://0.0.0.0:${server.address().port}`
      this.server = server
    })
    tester.context = this
    return tester
  }
  async _destroy() {
    this._destroyed = true
    if (this.server) await new Promise(r => {
      this.server.close(r)
    })
  }
}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 * @typedef {import('http').IncomingHttpHeaders} http.IncomingHttpHeaders
 * @typedef {import('http').Server} http.Server
 * @typedef {http.ServerResponse & { headers: http.IncomingHttpHeaders }} Response The response with headers.
 */

/** @typedef {import('./types').TestSuite} TestSuite */