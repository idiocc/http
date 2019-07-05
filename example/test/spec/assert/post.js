import HttpContext from '../../../../src'

/** @type {Object<string, (h: HttpContext, { middleware: !Function})} */
const TS = {
  context: [HttpContext, {
    /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    middleware(req, res) {
      const data = []
      req.on('data', d => { data.push(d) })
      req.on('end', () => {
        const d = data.join('')
        const {
          'user-agent': userAgent,
          'content-type': contentType,
        } = req.headers
        res.write(`Received data: ${d}`)
        res.write(` with Content-Type ${contentType}`)
        if (req.headers['user-agent'])
          res.write(` and User-Agent ${userAgent}`)
        res.end()
      })
    } }],
  // tests
  /* start example */
  async 'posts string data'({ startPlain }, { middleware }) {
    await startPlain(middleware)
      .post('/submit', 'hello')
      .assert(200, `Received data: hello `
        + `with Content-Type text/plain`)
  },
  async 'posts object data'({ startPlain }, { middleware }) {
    await startPlain(middleware)
      .post('/submit', { test: 'ok' })
      .assert(200, `Received data: {"test":"ok"} `
        + `with Content-Type application/json`)
  },
  async 'posts urlencoded data'({ startPlain }, { middleware }) {
    await startPlain(middleware)
      .post('/submit', { test: 'ok' }, {
        type: 'form',
        headers: {
          'User-Agent': 'testing',
        },
      })
      .assert(200, `Received data: test=ok `
        + `with Content-Type application/x-www-form-urlencoded `
        + `and User-Agent testing`)
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */