import HttpContext from '../../src'

export const context = HttpContext

/** @type {TestSuite} */
const T = {
  async 'request the server with 201'({ startPlain }) {
    await startPlain((req, res) => {
      res.statusCode = 201
      res.end('ok')
    })
      .get('/')
      .assert(201, 'ok')
  },
}

export default T

/** @typedef {import('../../src').TestSuite} TestSuite */