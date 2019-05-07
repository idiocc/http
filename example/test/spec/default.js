import HttpContext from '@contexts/http'
import middleware from '../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  async 'prevents unauthorised'({ start }) {
    await start(middleware)
      .get('/')
      .assert(500, 'The authentication is required.')
  },
  async 'does not find the user'({ start }) {
    await start(middleware)
      .set('x-auth', 'missing-key')
      .get('/')
      .assert(500, 'The user is not found.')
  },
  async 'authenticates known user'({ start }) {
    await start(middleware)
      .set('x-auth', 'secret-token')
      .get('/')
      .assert(200, 'Hello, ExampleUser')
  },
}

export default TS