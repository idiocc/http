import HttpContext from '../../../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'sets the header'({ startPlain }) {
    await startPlain((req, res) => {
      if (req.headers['x-auth'] == 'token') {
        res.statusCode = 205
        res.end('hello')
      } else {
        res.statusCode = 403
        res.end('forbidden')
      }
    })
      .set('x-auth', 'token')
      .get()
      .assert(205)
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */