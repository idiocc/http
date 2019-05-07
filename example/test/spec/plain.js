import HttpContext from '../../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  async 'sets the status code and body'({ startPlain }) {
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

/** @type {Object<string, (h: HttpContext)} */
export const handled = {
  context: [class {
    c(listener) {
      return (req, res) => {
        try {
          listener(req, res)
        } catch (err) {
          res.statusCode = 500
        } finally {
          res.end()
        }
      }
    }
  }, HttpContext],
  async 'throws an error'({ c }, { startPlain }) {
    await startPlain(c(() => {
      throw new Error('Unhandled error.')
    }))
      .get('/')
      .assert(500)
  },
  async 'times out'({ c }, { startPlain }) {
    await startPlain(c((req, res) => {
      res.write('hello')
    }))
      .get('/')
      .assert(200, 'hello')
  },
}

export default TS