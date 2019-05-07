/* start example */
import H from '../../../src'
import server from '../../src/server'

/** @type {Object<string, (h: H)} */
const TS = {
  context: H,
  async 'access the server'({ listen }) {
    await listen(server)
      .get('/')
      .assert(200, 'hello, world!')
  },
  async 'connect catches errors'({ listen }) {
    await listen(server)
      .get('/error')
      .assert(500)
  },
}

export default TS

/* end example */
// import { createServer } from 'http'
// async 'zoroaster catches errors'(
//   { listen }) {
//   await listen(createServer((req, res) => {
//     res.statusCode = 500
//     res.end()
//     throw new Error('Uncaught Error')
//   }))
//     .get('/error')
//     .assert(500)
// },