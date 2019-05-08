import HttpContext from '../../../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'status code'({ startPlain }) {
    await startPlain((_, res) => {
      res.statusCode = 205
      res.end()
    })
      .get()
      .assert(205)
  },
  async 'status code with message'({ startPlain }) {
    await startPlain((_, res) => {
      res.statusCode = 205
      res.end('example')
    })
      .get('/sitemap')
      .assert(205, 'example')
  },
  async 'status code with regexp'({ startPlain }) {
    await startPlain((_, res) => {
      res.statusCode = 205
      res.end('Example')
    })
      .get('/sitemap')
      .assert(205, /example/i)
  },
  async 'status code with json'({ startPlain }) {
    await startPlain((_, res) => {
      res.statusCode = 205
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ hello: 'world' }))
    })
      .get('/sitemap')
      .assert(205, { hello: 'world' })
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */