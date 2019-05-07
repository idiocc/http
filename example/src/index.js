const users = {
  'secret-token': 'ExampleUser',
}

/**
 * User Authentication Route.
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const middleware = (req, res) => {
  const token = req.headers['x-auth']
  if (!token) throw new Error('The authentication is required.')
  const user = users[token]
  if (!user) throw new Error('The user is not found.')
  res.setHeader('set-cookie', `user=${user}`)
  res.end(`Hello, ${user}`)
}

export default middleware

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */