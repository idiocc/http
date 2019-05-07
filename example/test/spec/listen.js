import H from '../../../src'
import { createServer } from 'http'
import server from '../../src/server'

/** @type {Object<string, (h: H)} */
const TS = {
  context: H,
  async 'access the server'({ listen }) {
    await listen(server)
      .get('/')
      .assert(200, 'hello, world!')
  },
  async 'connect catches errors'(
    { listen }) {
    await listen(server)
      .get('/error')
      .assert(500)
  },
  async 'zoroaster catches errors'(
    { listen }) {
    await listen(createServer((req, res) => {
      res.statusCode = 500
      res.end()
      throw new Error('Uncaught Error')
    }))
      .get('/error')
      .assert(500)
  },
}

export default TS