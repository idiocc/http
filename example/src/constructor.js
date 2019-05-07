/**
 * Creates a middleware for the given list of users.
 * @param {Object<string, string>} users
 */
const makeMiddleware = (users) => {
  /**
   * Updates the request to have the user information if the token is found.
   * @param {http.IncomingMessage} req
   */
  const middleware = (req) => {
    const token = req.headers['x-auth']
    const user = users[token]
    if (user) req['user'] = user
  }
  return middleware
}

export default makeMiddleware

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */