import { createServer } from 'http'
import { join } from 'path'
import { createServer as createSecureServer, Server as HttpsServer } from 'https'
import { readFileSync } from 'fs'
import cleanStack from '@artdeco/clean-stack'
import { c } from 'erte'
import Tester from './Tester'

const cert = readFileSync(join(__dirname, 'server.crt'), 'ascii')
const key = readFileSync(join(__dirname, 'server.key'), 'ascii')

export default class Server {
  constructor() {
    /**
     * The constructor for the tester that will be returned by the `start` method. Additional assertions can be implemented by extending the `Tester` class that comes with the server.
     */
    this.TesterConstructor = Tester
    /**
     * The HTTP(S) server will be set on the tester after the `start` method is called. It will be automatically destroyed by the end of the test.
     * @type {http.Server|https.Server}
     */
    this.server = null
    /**
     * After the request listener is called, the `response` will be set to the server response which comes as the second argument to the request listener callback. The response will be updated to contain parsed headers. When using the `listen` method, only the headers received will be accessed via the object.
     * @type {Response}
     */
    this.response = {}
  }
  /**
   * Call to switch on printing of debug messages and error stacks in the response body.
   * @param {boolean} [on] Whether to switch on debugging. Default `true`.
   */
  debug(on = true) {
    this._debug = on
  }
  /**
   * Creates a server and wraps the supplied listener in the handler that will set status code `500` if the listener threw and the body to the error text, and `200` otherwise.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn The server callback.
   * @param {boolean} [secure=false] Whether to start an https server.
   */
  start(fn, secure = false) {
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
    return this._start(handler, secure)
  }
  /**
   * Creates a server with the supplied listener.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn The server callback.
   * @param {boolean} [secure=false] Whether to start an https server.
   */
  startPlain(fn, secure) {
    /** @type {function(http.IncomingMessage, http.ServerResponse)} */
    const handler = async (req, res) => {
      try {
        this.response = res
        await fn(req, res)
      } catch (err) {
        if (this._debug) console.error(c(cleanStack(err.stack), 'yellow'))
        throw err
      }
    }
    return this._start(handler, secure)
  }
  /**
   * @private
   */
  _start(handler, secure) {
    let server
    // const handler
    if (secure) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
      server = createSecureServer({ cert, key }, handler)
    } else {
      server = createServer(handler)
    }
    return this.listen(server)
  }
  async _destroy() {
    if (this.response && this.response.end) this.response.end()
    this._destroyed = true
    if (this.server) await new Promise(r => {
      this.server.close(r)
    })
  }
  /**
   * Calls the `listen` method on the server to accept incoming connections.
   * @param {http.Server|https.Server} server The server to start.
   */
  listen(server) {
    const secure = server instanceof HttpsServer
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
}

export { Tester }

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 * @typedef {import('http').IncomingHttpHeaders} http.IncomingHttpHeaders
 * @typedef {import('http').Server} http.Server
 * @typedef {import('https').Server} https.Server
 * @typedef {http.ServerResponse & { headers: http.IncomingHttpHeaders }} Response The response with headers.
 */

/** @typedef {import('./types').TestSuite} TestSuite */