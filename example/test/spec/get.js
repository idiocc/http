import HttpContext from '../../../src'

/** @type {function(IncomingMessage, ServerResponse)} */
const middleware = (req, res) => {
  if (req.url == '/') {
    res.statusCode = 302
    res.setHeader('location', 'index.html')
  } else if (req.url == '/sitemap') {
    res.statusCode = 200
  }
  res.end()
}

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'redirects to /'({ start }) {
    await start(middleware)
      .get()
      .assert(302)
      .assert('location', 'index.html')
  },
  async 'opens sitemap'({ start }) {
    await start(middleware)
      .get('/sitemap')
      .assert(200)
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */