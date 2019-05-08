import HttpContext from '../../../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'asserts header'({ startPlain }) {
    await startPlain((_, res) => {
      res.statusCode = 205
      res.setHeader('content-type', 'application/json')
      res.end('[]')
    })
      .get('/sitemap')
      .assert(205)
      .assert('content-type', 'application/json')
  },
  async 'asserts absence of a header'({ startPlain }) {
    await startPlain((_, res) => {
      res.end()
    })
      .get('/sitemap')
      .assert('content-type', null)
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */