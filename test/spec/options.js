import { equal } from '@zoroaster/assert'
import HttpContext from '../../src'

export const context = HttpContext

const T = {
  /* start example */
  async 'sends options request'({ start }) {
    let method
    await start((req, res) => {
      method = req.method
      res.setHeader('allow', 'HEAD, GET')
      res.statusCode = 204
    })
      .options('/')
      .assert(204)
      .assert('allow', 'HEAD, GET')
    equal(method, 'OPTIONS')
  },
  /* end example */
}

export default T