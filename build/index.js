const { createServer } = require('http');
const { join } = require('path');
const { createServer: createSecureServer, Server: HttpsServer } = require('https');
const { readFileSync } = require('fs');
let cleanStack = require('@artdeco/clean-stack'); if (cleanStack && cleanStack.__esModule) cleanStack = cleanStack.default;
const { c } = require('erte');
const Tester = require('./Tester');

const cert = readFileSync(join(__dirname, 'server.crt'), 'ascii')
const key = readFileSync(join(__dirname, 'server.key'), 'ascii')

               class Server {
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
     * After the request listener is called, the `response` will be set to the server response which comes as the second argument to the request listener callback. Is not set when using the `listen` method.
     * @type {http.ServerResponse}
     */
    this.response = null
    /**
     * The map of connections to the server. Used to finish any unended requests.
     * @type {Object<string, net.Socket>}
     */
    this._connections = {}
    /**
     * The tester created after the start, startPlain or listen methods.
     */
    this.tester = null
  }
  /**
   * Call to switch on printing of debug messages and error stacks in the response body.
   * @param {boolean} [on] Whether to switch on debugging. Default `true`.
   */
  debug(on = true) {
    this._debug = on
  }
  /**
   * Returns the server response after the request listener finished.
   */
  getResponse() {
    return this.response
  }
  /**
   * Creates a server and wraps the supplied listener in the handler that will set status code `500` if the listener threw and the body to the error text.
   * @param {function(http.IncomingMessage, http.ServerResponse)} fn The server callback.
   * @param {boolean} [secure=false] Whether to start an https server.
   */
  start(fn, secure = false) {
    const handler = async (req, res) => {
      try {
        this.response = res
        await fn(req, res)
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
    this._destroyed = true
    if (this.server) await new Promise(r => {
      this.server.close(r)
      for (let k in this._connections) {
        this._connections[k].destroy()
      }
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
    server.on('connection', (con) => {
      const { remoteAddress, remotePort } = con
      const k = [remoteAddress, remotePort].join(':')
      this._connections[k] = con
      con.on('close', () => {
        delete this._connections[k]
      })
    })
    this.tester = tester
    return tester
  }
}



/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 * @typedef {import('http').IncomingHttpHeaders} http.IncomingHttpHeaders
 * @typedef {import('http').Server} http.Server
 * @typedef {import('https').Server} https.Server
 * @typedef {import('net').Socket} net.Socket
 * @typedef {import('@rqt/aqt').AqtReturn} AqtReturn
 */

/** @typedef {import('../types').TestSuite} TestSuite */

module.exports = Server
module.exports.Tester = Tester