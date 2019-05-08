import HttpContext from '../../../../src'
import { equal } from 'assert'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'asserts using a function'({ start }) {
    await start((_, res) => {
      res.statusCode = 205
      res.setHeader('content-type', 'application/xml')
      res.end()
    })
      .get('/sitemap')
      .assert((res) => {
        equal(res.headers['content-type'], 'application/xml')
      })
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */