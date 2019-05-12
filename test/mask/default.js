import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import http from '../../src/tester'

// export default
makeTestSuite('test/result', {
  async getResults() {
    const res = await http({
      text: this.input,
    })
    return res
  },
  context: Context,
})