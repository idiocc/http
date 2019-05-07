import { ok, equal } from 'assert'
import HttpContext from '../../../src'
import createMiddleware from '../../src/constructor'

class Context {
  /**
   * Creates a request listener for testing.
   * @param {function(http.IncomingMessage, http.ServerResponse)} next
   * Assertion method.
   * @param {Object<string, string>} [users] The list of tokens-users.
   */
  c(next, users = {}) {
    return (req, res) => {
      const mw = createMiddleware(users)
      mw(req, res) // set the user on request
      next(req, res)
    }
  }
}

/** @type {Object<string, (c: Context, h: HttpContext)} */
const TS = {
  context: [Context, HttpContext],
  async 'does not set the user without token'({ c }, { start }) {
    await start(c((req) => {
      ok(!req.user)
    }))
      .get('/')
      .assert(200)
  },
  async 'does not set the user with missing token'({ c }, { start }) {
    await start(c((req) => {
      ok(!req.user)
    }), { 'secret-token': 'User' })
      .set('x-auth', 'missing-token')
      .get('/')
      .assert(200)
  },
  async 'sets the user'({ c }, { start }) {
    await start(c((req) => {
      ok(req.user)
    }, { 'secret-token': 'User' }))
      .set('x-auth', 'secret-token')
      .get('/')
      .assert(200)
  },
  async 'sets the correct name'({ c }, { start }) {
    await start(c((req) => {
      equal(req.user, 'Expected-User')
    }, { 'secret-token': 'Actual-User' }))
      .set('x-auth', 'secret-token')
      .get('/')
      .assert(200) // expecting fail
  },
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */