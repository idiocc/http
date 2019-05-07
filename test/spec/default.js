import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import http from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof http, 'function')
  },
  async 'calls package without error'() {
    await http()
  },
  async 'gets a link to the fixture'({ fixture }) {
    const text = fixture`text.txt`
    const res = await http({
      text,
    })
    ok(res, text)
  },
}

export default T