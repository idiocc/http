import { equal, throws } from '@zoroaster/assert'
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
  async 'request the server with 500'({ start }) {
    await start(() => {
      throw new Error('There was an error')
    })
      .get('/')
      .assert(500, /There was an error/g)
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
      message: /'hello' == 'world'/,
    })
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
}

/** @type {TestSuite} */
export const Debug = {
  async 'sets the header'({ start, debug }) {
    debug()
    await throws({
      async fn() {
        await start(() => {
          throw new Error('actual-body')
        })
          .get('/')
          .assert(200)
      },
      message: /at start/,
    })
  },
}

export default T

/** @typedef {import('../../src').TestSuite} TestSuite */