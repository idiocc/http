import HttpContext from '../../../src'
import middleware from '../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  /* start example */
  async 'sets the code to 200'({ start, debug }) {
    debug()
    await start(middleware)
      .get()
      .assert(200)
  },
  /* end example */
}

export default TS