import { equal, throws, ok } from '@zoroaster/assert'
import HttpContext from '../../src'

export const context = HttpContext

/** @type {TestSuite} */
const T = {
  'is a function'() {
    equal(typeof HttpContext, 'function')
  },
  async 'request the server with 200'({ start }) {
    await start((req, res) => {
      res.end('hello world')
    })
      .get('/')
      .assert(200, 'hello world')
  },
  async 'request the server with custom code'({ start }) {
    await start((req, res) => {
      res.statusCode = 201
      res.end('hello world')
    })
      .get('/')
      .assert(201, 'hello world')
  },
  async 'request the server with 500'({ start }) {
    await start(() => {
      throw new Error('There was an error')
    })
      .get('/')
      .assert(500, /There was an error/)
  },
  async 'throws on wrong code'({ start }) {
    await throws({
      async fn() {
        await start(() => {
          throw new Error('There was an error')
        })
          .get('/')
          .assert(200)
      },
      message: /There was an error/,
    })
  },
  async 'throws on wrong body'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.end('hello')
        })
          .get('/')
          .assert(200, 'world')
      },
      message: /- world(.+?)\s+(.+?)\+ hello/,
    })
  },
  async 'throws on empty string'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.end('hello')
        })
          .get('/')
          .assert(200, '')
      },
      message: /- (.+?)\s+(.+?)\+ hello/,
    })
  },
}

export const headersFail = {
  async 'throws on header missing'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.end('hello')
        })
          .get('/')
          .assert('content-type', 'application/json')
      },
      message: /Header .+content-type.+ was expected:[\s\S]+- application\/json/,
    })
  },
  async 'throws on header present'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.setHeader('content-type', 'application/xml')
          res.end('hello')
        })
          .get('/')
          .assert('content-type', null)
      },
      message: /Header .+content-type.+ was not expected:[\s\S]+\+ application\/xml/,
    })
  },
  async 'throws on header mismatch by value'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.setHeader('content-type', 'application/xml')
          res.end('hello')
        })
          .get('/')
          .assert('content-type', 'application/json')
      },
      message: /Header .+content-type.+ did not match value:[\s\S]+- application\/json[\s\S]+\+ application\/xml/,
    })
  },
  async 'throws on header mismatch by regexp'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.setHeader('content-type', 'application/xml')
          res.end('hello')
        })
          .get('/')
          .assert('content-type', /json/)
      },
      message: /Header .+content-type.+ did not match RexExp:[\s\S]+- \/json\/[\s\S]+\+ application\/xml/,
    })
  },
}

/** @type {TestSuite} */
export const head = {
  async 'sends head request'({ start }) {
    let method
    await start((req, res) => {
      method = req.method
      res.setHeader('x-test', 'test')
      res.end('hello world')
    })
      .head('/')
      .assert(200, '')
      .assert('x-test', 'test')
    equal(method, 'HEAD')
  },
}

/** @type {TestSuite} */
export const assertFunction = {
  async 'passes assert function'({ start }) {
    await start((req, res) => {
      res.setHeader('x-test', 'test')
      res.end('hello world')
    })
      .get('/')
      .assert((response) => {
        equal(response.headers['x-test'], 'test')
      })
  },
  async 'throws on assert function fail'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.setHeader('x-test', 'test')
          res.end('hello world')
        })
          .get('/')
          .assert((response) => {
            equal(response.headers['x-test'], 'test1')
          })
      },
      message: /'test' == 'test1'/,
    })
  },
}

/** @type {TestSuite} */
export const headers = {
  async 'sets the header'({ start }) {
    await start((req, res) => {
      res.end(req.headers['cookie'])
    })
      .set('cookie', 'hello-world')
      .get('/')
      .assert(200, 'hello-world')
  },
  async 'sets multiple headers'({ start }) {
    await start((req, res) => {
      res.end(req.headers['cookie'] + '-' + req.headers['cookie2'])
    })
      .set('cookie', 'hello')
      .set('cookie2', 'world')
      .get('/')
      .assert(200, 'hello-world')
  },
  async 'sets header with a function'({ start }) {
    let cookie
    await start((req, res) => {
      res.setHeader('x-test', 'world')
      res.end(req.headers['test'])
    })
      .set('test', 'hello')
      .get('/')
      .assert(200, 'hello')
      .assert(({ headers: h }) => {
        cookie = h['x-test']
      })
      .set('test', () => cookie)
      .get('/')
      .assert(200, 'world')
  },
}

/** @type {TestSuite} */
export const Debug = {
  async 'prints the error to the body'({ start, debug }) {
    debug()
    await throws({
      async fn() {
        await start(() => {
          throw new Error('actual-body')
        })
          .get('/')
          .assert(200)
      },
      message: /actual-body/,
    })
  },
}

/** @type {TestSuite} */
export const Https = {
  async 'starts https server'({ start }) {
    await start((req) => {
      ok(req.protocol == 'https' || req.connection.encrypted)
    }, true)
      .get('/')
      .assert(200)
  },
}

/** @type {TestSuite} */
export const JSON = {
  async 'parses JSON requests'({ start }) {
    await start((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.end('{ "hello": "world" }')
    })
      .get('/')
      .assert(200, { hello: 'world' })
  },
  async 'throws errors with json'({ start }) {
    await throws({
      async fn() {
        await start((req, res) => {
          res.setHeader('content-type', 'application/json')
          res.end('{ "hello": "world" }')
        })
          .get('/')
          .assert(200, { world: 'hello' })
      },
      message: /- world: hello[\s\S]+?\+ hello: world/,
    })
  },
}

export default T

/** @typedef {import('../context').TestSuite} TestSuite */