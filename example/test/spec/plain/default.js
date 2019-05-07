import HttpContext from '../../../../src'

/* start example */
class Context {
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
}

/** @type {Object<string, (c:Context, h: HttpContext)} */
export const handled = {
  context: [Context, HttpContext],
  async 'throws an error'({ c },
    { startPlain }) {
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
/* end example */