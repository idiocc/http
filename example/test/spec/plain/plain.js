import HttpContext from '../../../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  async 'sets the status code and body'(
    { startPlain }) {
    await startPlain((req, res) => {
      res.statusCode = 200
      res.end('Hello World')
    })
      .get('/')
      .assert(200, 'Hello World')
  },
  // expect to fail with global error
  async 'throws an error'({ startPlain }) {
    await startPlain(() => {
      throw new Error('Unhandled error.')
    })
      .get('/')
  },
  // expect to timeout
  async 'does not finish the request'({ startPlain }) {
    await startPlain((req, res) => {
      res.write('hello')
    })
      .get('/')
  },
}

export default TS