import CookieContext from '../../../context/Context'

/** @type {Object<string, (h: CookieContext)} */
const TS = {
  context: CookieContext,
  async 'sets the HttpOnly cookie'({ start }) {
    await start((req, res) => {
      res.setHeader('set-cookie',
        'example=@http/context; HttpOnly')
    })
      .get('/')
      .attribute('example', 'HttpOnly')
      .noAttribute('example', 'Secure')
  },
  async 'deletes the cookie'({ start }) {
    await start((req, res) => {
      res.setHeader('set-cookie', [
        `example=@http/context; HttpOnly'`,
        `zoroaster=context-testing; Max-Age=-1`,
      ])
    })
      .get('/')
      .count(2)
      .attributeAndValue('zoroaster', 'max-age', -1)
  },
  async 'sets cookie for a path'({ start }) {
    await start((req, res) => {
      res.setHeader('set-cookie',
        `example=@http/context'`)
    })
      .get('/')
      .attribute('example', 'path', '/cookies')
  },
}

export default TS