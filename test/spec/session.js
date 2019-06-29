import HttpContext from '../../src'

/** @type {TestSuite} */
export const viaSessionMethod = {
  context: HttpContext,
  async 'maintains the session'({ start, debug }) {
    debug()
    await start((req, res) => {
      if (req.url == '/') {
        res.setHeader('set-cookie', 'koa:sess=eyJtZ; path=/; httponly')
        res.end('hello world')
      } else if (req.url == '/exit') {
        res.setHeader('set-cookie', 'koa:sess=; path=/; httponly')
        res.end()
      } else if (req.url == '/test') {
        res.end(req.headers['cookie'])
      }
    })
      .session()
      .get('/')
      .assert(200, 'hello world')
      .get('/test')
      .assert(200, 'koa:sess=eyJtZ')
      .get('/exit')
      .get('/test')
      .assert(200, '')
  },
}

/** @type {TestSuite} */
export const viaExtendingContext = {
  context: class extends HttpContext {
    constructor() {
      super()
      this.session = true
    }
  },
  async 'maintains the session'({ start, debug }) {
    debug()
    await start((req, res) => {
      if (req.url == '/') {
        res.setHeader('set-cookie', 'koa:sess=eyJtZ; path=/; httponly')
        res.end('hello world')
      } else if (req.url == '/exit') {
        res.setHeader('set-cookie', 'koa:sess=; path=/; httponly')
        res.end()
      } else if (req.url == '/test') {
        res.end(req.headers['cookie'])
      }
    })
      .get('/')
      .assert(200, 'hello world')
      .get('/test')
      .assert(200, 'koa:sess=eyJtZ')
      .get('/exit')
      .get('/test')
      .assert(200, '')
  },
}

/** @typedef {import('../context').TestSuite} TestSuite */