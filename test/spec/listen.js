import { createServer } from 'http'
import HttpContext from '../../src'

export const context = HttpContext

/** @type {TestSuite} */
const T = {
  async 'request the server with 201'({ listen }) {
    const server = createServer((req, res) => {
      res.statusCode = 201
      res.end('ok')
    })
    await listen(server)
      .get('/')
      .assert(201, 'ok')
  },
  // async '!destroys the server'({ listen }) {
  //   const server = createServer((req, res) => {
  //     res.statusCode = 201
  //   })
  //   await listen(server)
  //     .get('/')
  // },
}

export default T

/** @typedef {import('../context').TestSuite} TestSuite */