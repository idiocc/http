import HttpContext from '../../../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'sets a header with a function'({ start }) {
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
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */