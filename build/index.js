const { createServer } = require('http');
const { createServer: createSecureServer, Server: HttpsServer } = require('https');
const { join } = require('path');
const { readFileSync } = require('fs');
const cleanStack = require('@artdeco/clean-stack');
const { c } = require('erte');
const { equal, ok } = require('assert');
const aqt = require('@rqt/aqt');
const erotic = require('erotic');
const { format } = require('url');
const deepEqual = require('@zoroaster/deep-equal');
const { readBuffer } = require('@wrote/read');
const { parseSetCookie, wasExpectedError, didNotMatchValue, wasNotExpected } = require('./lib');

const CERT = readFileSync(join(__dirname, 'server.crt'), 'ascii')
const KEY = readFileSync(join(__dirname, 'server.key'), 'ascii')

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
    /**
     * Whether to manage the session cookies.
     */
    this.session = false
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
      server = createSecureServer({ cert: CERT, key: KEY }, handler)
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
      tester.url = format({
        protocol: secure ? 'https' : 'http',
        hostname: '0.0.0.0',
        port: server.address().port,
      })
      this.server = server
    })
    tester.context = this
    if (this.session) tester._session = true
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
  /**
   * The method will be called prior to making further requests.
   */
  _reset() {

  }
}

/**
 * The tester for assertions.
 */
class Tester extends Promise {
  constructor() {
    super(() => {})
    /**
     * The headers to send with the request, must be set before the `get` method is called using the `set` method.
     * @type {http.OutgoingHttpHeaders}
     */
    this._headers = {}

    /**
     * @private
     */
    this._chain = Promise.resolve(true)
    /**
     * The reference to the parent context that started the server.
     * @type {Server}
     */
    this.context = null
    /**
     * The response saved after requests.
     * @type {import('@rqt/aqt').AqtReturn}
     */
    this.res = null
    /**
     * Whether the cookies will be maintained by the tester.
     */
    this._session = false
    /**
     * When using the session, stores the cookies.
     */
    this._cookies = {}
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
   * Save the result.
   * @param {AqtReturn} res
   * @param {string} path The request path.
   * @private
   */
  _assignRes(res, path) {
    this.res = res
    if (this._session) {
      const ch = res.headers['set-cookie'] || []
      const parsed = ch.map(parseSetCookie)
      parsed.forEach(({ name, expires, value }) => {
        if (!value) {
          if (this.context._debug)
            console.error(
              c(path, 'grey'),
              c(`Server deleted cookie ${name}`, 'yellow'))
          delete this._cookies[name]
          return
        }
        if (expires && (new Date(expires) <= new Date())) {
          if (this.context._debug)
            console.error(
              c(path, 'grey'),
              c(`Cookie ${name} expired`, 'yellow'))
          delete this._cookies[name]
          return
        }
        this._cookies[name] = value
        if (this.context._debug)
          console.error(
            c(path, 'grey'),
            c('Setting cookie', 'yellow'),
            c(name, 'blue'),
            c(`to ${value}`, 'yellow'),
            expires ? c(`(expires ${expires})`, 'grey') : '')
      })
    }
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
      this.context._reset()
      const res = await aqt(`${this.url}${path}`, {
        headers: this.headers,
      })
      this._assignRes(res, path)
    })
    return this
  }
  /**
   * Post data to the path. By default, sends JSON-stringified body with `application/json` content type, unless specified otherwise in options (e.g., pass `{ type: form }` for `application/x-www-form-urlencoded` content-type).
   * @param {string} [path] The path to navigate, empty by default.
   * @param {string|Buffer} [data] The data to send.
   * @param {!AqtOptions} [options] The options for the request library.
   */
  post(path = '', data = undefined, options = {}) {
    this._addLink(async () => {
      this.context._reset()
      const res = await aqt(`${this.url}${path}`, {
        headers: this.headers,
        data,
        ...options,
      })
      this._assignRes(res, path)
    })
    return this
  }
  /**
   * Post form-data to the path.
   * @param {string} path The path to post data to, empty by default.
   * @param {(form: Form) => void} [cb] The callback with the form.
   */
  postForm(path = '', cb) {
    this._addLink(async () => {
      this.context._reset()
      const form = new Form()
      await cb(form)
      const { data } = form
      const res = await aqt(`${this.url}${path}`, {
        headers: { ...this.headers,
          'Content-Type': `multipart/form-data; boundary=${form.boundary}` },
        type: null,
        data,
      })
      this._assignRes(res, path)
    })
    return this
  }
  /**
   * Send a `HEAD` request to the server.
   * @param {string} path The path to navigate, empty by default.
   */
  head(path = '') {
    this._addLink(async () => {
      const res = await aqt(`${this.url}${path}`, {
        headers: this.headers,
        method: 'HEAD',
      })
      this._assignRes(res)
    })
    return this
  }
  get headers() {
    const cookies = Object.keys(this._cookies).map(((k) => {
      const val = this._cookies[k]
      return `${k}=${val}`
    }))
    if (this._headers.Cookie) cookies.push(this._headers.Cookie)
    const Cookie = cookies.join(';')
    return {
      ...this._headers,
      ...(Cookie ? { Cookie } : {}),
    }
  }
  /**
   * Assert on the status code and body when a number is given.
   * Assert on the header when the string is given. If the second arg is null, asserts on the absence of the header.
   * @param {number|string|function(AqtReturn)} code The number of the status code, or name of the header, or the custom assertion function.
   * @param {String} message The body or header value (or null for no header).
   */
  assert(code, message) {
    const e = erotic(true)
    this._addLink(async () => {
      if (typeof code == 'function') {
        await code(this.res)
        return
      }
      if (typeof code == 'string') {
        const header = this.res.headers[code.toLowerCase()]
        if (message instanceof RegExp) {
          ok(message.test(header), `Header ${c(code, 'blue')} did not match RexExp:
  ${c(`- ${message}`, 'red')}
  ${c(`+ ${header}`, 'green')}`)
          return
        } else if (message && !header){
          throw new Error(wasExpectedError('Header', code, message))
        } else if (message) {
          equal(header, message, didNotMatchValue('Header', code, message, header))
          return
        } else if (message === null) {
          if (header)
            throw new Error(wasNotExpected('Header', code, header))
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
      } else if (message !== undefined) equal(this.res.body, message)
    }, e)
    return this
  }
  /**
   * Sets the value for the header in the upcoming request.
   * @param {string} name The name of the header to set.
   * @param {string|function(): (Promise<string>|string)} value The value to set.
   */
  set(name, value) {
    this._addLink(async () => {
      if (typeof value == 'function') {
        value = await value()
      }
      this._headers[name] = value
    })
    return this
  }
  /**
   * Start the session, by keeping track of the cookies that are send via the `set-cookies` header (added, removed).
   */
  session() {
    this._session = true
    return this
  }
}

class Form {
  constructor() {
    /**
     * @type {Array<Buffer>}
     */
    this._data = []
  }
  /**
   * @param {string} path The path to the file.
   * @param {string} name The name of the field.
   * @param {Object} [options] Options for the file.
   * @param {string} [options.contentType="application/octet-stream"] The content-type.
   * @param {string} [options.noCache=false] Disable caching.
   */
  async addFile(path, name, {
    contentType = 'application/octet-stream',
    noCache = false,
  } = {}) {
    let file
    if (path in formCache || noCache) {
      file = formCache[path]
    } else {
      file = await readBuffer(path)
      formCache[path] = file
    }
    this.writeLine(`\r\n--${this.boundary}`)
    this.writeLine(`Content-Disposition: form-data; name="${name}"; filename="${path}"`)
    this.writeLine(`Content-Type: ${contentType}`)
    this.writeLine()
    this._data.push(file)
  }
  writeLine(line) {
    if (line) this._data.push(typeof line == 'string' ? Buffer.from(line) : line)
    this._data.push(Buffer.from('\r\n'))
  }
  /**
   * The boundary.
   */
  get boundary() {
    return 'u2KxIV5yF1y+xUspOQCCZopaVgeV6Jxihv35XQJmuTx8X3sh'
  }
  /**
   * Complete data.
   */
  get data() {
    this.writeLine(`\r\n--${this.boundary}--`)

    return Buffer.concat(this._data).toString()
  }
  /**
   * Adds a key-value pair to the form.
   * @param {string} key The key to add.
   * @param {string} value The value for the key.
   */
  addSection(key, value) {
    const b = Buffer.from('\r\n--' + this.boundary
                      + '\r\nContent-Disposition: form-data; name="'
                      + key + '"\r\n\r\n' + value)
    this._data.push(b)
  }
}

const formCache = {}

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {import('http').OutgoingHttpHeaders} http.OutgoingHttpHeaders
 * @typedef {import('http').IncomingHttpHeaders} http.IncomingHttpHeaders
 * @typedef {import('http').Server} http.Server
 * @typedef {import('https').Server} https.Server
 * @typedef {import('net').Socket} net.Socket
 * @typedef {import('@rqt/aqt').AqtReturn} AqtReturn
 * @typedef {import('@rqt/aqt').AqtOptions} AqtOptions
 */

/** @typedef {import('./types').TestSuite} TestSuite */

module.exports = Server
module.exports.Tester = Tester