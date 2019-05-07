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
  async 'throws an error'({ startPlain }) {
    await startPlain(() => {
      throw new Error('Unhandled error.')
    })
      .get('/')
  },
  async 'times out'({ startPlain }) {
    await startPlain((req, res) => {
      res.write('hello')
    })
      .get('/')
  },
}

export default TS