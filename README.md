# @contexts/http

[![npm version](https://badge.fury.io/js/%40contexts%2Fhttp.svg)](https://npmjs.org/package/@contexts/http)

`@contexts/http` is The Http(s) Testing Context For Super-Test Style Assertions. Includes Standard Assertions (get, set, assert), And Allows To Be Extended With JSDocumented Custom Assertions.

```sh
yarn add @contexts/http
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class HttpContext](#class-httpcontext)
  * [`constructor()`](#constructor-void)
  * [`start(fn: (req: IncomingMessage, res: ServerResponse), secure: boolean=): Tester`](#startfn-req-incomingmessage-res-serverresponsesecure-boolean-tester)
  * [`startPlain(fn: (req: IncomingMessage, res: ServerResponse), secure: boolean=): Tester`](#startplainfn-req-incomingmessage-res-serverresponsesecure-boolean-tester)
- [Extending](#extending)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import HttpContext, { Tester } from '@contexts/http'
```

When [extending](#extending) the context, the `Tester` class also needs to be imported.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## class HttpContext

This testing context is to be used with [_Zoroaster Context Testing Framework_](https://contexttesting.com). Once it is defined as part of a test suite, it will be available to all inner tests via the arguments. It allows to specify the middleware function to start the server with, and provides an API to send requests, while setting headers, and then assert on the result that came back. It was inspired by `supertest`, but is asynchronous in nature so that no `done` has to be called &mdash; just the promise needs to be awaited on.

<table>
<tr><th>Using <em>HttpContext</em> Example</th></tr>
<tr><td>

```js
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
```
</td></tr>
<tr><td>
For example, we might want to test some synchronous middleware. It will check for the authentication token in the headers, reject the request if it is not present, or if the corresponding user is not found, and write the response if everything is OK.
</tr></td>
<tr><td>

```js
import HttpContext from '@contexts/http'
import middleware from '../../src'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  async 'prevents unauthorised'({ start }) {
    await start(middleware)
      .get('/')
      .assert(500, 'The authentication is required.')
  },
  async 'does not find the user'({ start }) {
    await start(middleware)
      .set('x-auth', 'missing-key')
      .get('/')
      .assert(500, 'The user is not found.')
  },
  async 'authenticates known user'({ start }) {
    await start(middleware)
      .set('x-auth', 'secret-token')
      .get('/')
      .assert(200, 'Hello, ExampleUser')
  },
}

export default TS
```
</td></tr>
<tr><td>The tests are written for <em>Zoroaster</em> in such a way that test suite objects are exported. When the <code>context</code> property is found on the test suite, it will be instantiated for all inner tests.
</td></tr>
<tr><td>

```
example/test/spec/default.js
  ✓  prevents unauthorised
  ✓  does not find the user
  ✓  authenticates known user

🦅  Executed 3 tests.
```
</td></tr>
<tr><td>The tests can be run with <em>Zoroaster</em> test runner: <code>zoroaster example/test/spec -a</code>.
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="25"></a></p>

### `constructor(): void`

The constructor is not used manually, it will be called by _Zoroaster_ automatically.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="25"></a></p>


### `start(`<br/>&nbsp;&nbsp;`fn: (req: IncomingMessage, res: ServerResponse),`<br/>&nbsp;&nbsp;`secure: boolean=,`<br/>`): Tester`

Starts the server with the given middleware function. It will setup an upper layer over the middleware to try it and catch any errors in it. If there were errors, the status code will be set to `500` and the response will be ended with the error message. Otherwise, the status is set to `200`. This is done so that assertion methods can be called inside of the supplied function. If the server needs to be started without the wrapper handler, the [`startPlain`](#start-plain) method can be used instead.

When the `secure` option is passed, the HTTPS server with self-signed keys will be started and `process.env.NODE_TLS_REJECT_UNAUTHORIZED` will be set to `0` so make sure this context is only used for testing, and not on the production env.

```js
// the handler installed by the `start` method.
const handler = async (req, res) => {
  try {
    await fn(req, res)
    res.statusCode = 200
  } catch (err) {
    res.statusCode = 500
    res.write(err.message)
    if (this._debug) console.error(error.stack)
  } finally {
    res.end()
  }
}
server.start(handler)
```

<table>
<tr><th>Middleware Constructor Testing Strategy</th></tr>
<tr><td>

```js
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
```
</td></tr>
<tr><td>We update the source code to export a constructor of middleware, based on the given options. In this case, the middleware will be created with the <code>users</code> object that is scoped within the function, rather that file, so that we can pass it at the point of creating the middleware.</td></tr>
<tr><td>

```js
import { ok, equal } from 'assert'
import HttpContext from '@contexts/http'
import createMiddleware from '../../src/constructor'

class Context {
  /**
   * Creates a request listener for testing.
   * @param {function(http.IncomingMessage, http.ServerResponse)} next
   * Assertion method.
   * @param {Object<string, string>} [users] The list of tokens-users.
   */
  c(next, users = {}) {
    return (req, res) => {
      const mw = createMiddleware(users)
      mw(req, res) // set the user on request
      next(req, res)
    }
  }
}

/** @type {Object<string, (c: Context, h: HttpContext)} */
const TS = {
  context: [Context, HttpContext],
  async 'does not set the user without token'({ c }, { start }) {
    await start(c((req) => {
      ok(!req.user)
    }))
      .get('/')
      .assert(200)
  },
  async 'does not set the user with missing token'({ c }, { start }) {
    await start(c((req) => {
      ok(!req.user)
    }), { 'secret-token': 'User' })
      .set('x-auth', 'missing-token')
      .get('/')
      .assert(200)
  },
  async 'sets the user with https'({ c }, { start }) {
    await start(c((req) => {
      ok(req.user)
      ok(req.connection.encrypted)
    }, { 'secret-token': 'User' }), true)
      .set('x-auth', 'secret-token')
      .get('/')
      .assert(200)
  },
  async 'sets the correct name'({ c }, { start }) {
    await start(c((req) => {
      equal(req.user, 'Expected-User')
    }, { 'secret-token': 'Actual-User' }))
      .set('x-auth', 'secret-token')
      .get('/')
      .assert(200) // expecting fail
  },
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */
```
</td></tr>
<tr><td>The new tests require implementing a method that will call the middleware constructor prior to continuing with the request. This method is creates as part of a different context, called simply <em>Context</em>. It will help to create the request listener to pass to the <code>start</code> method, where the assertions will be written in another middleware executed after the source code one.</td></tr>
<tr><td>

```
example/test/spec/constructor.js
  ✓  does not set the user without token
  ✓  does not set the user with missing token
  ✓  sets the user with https
  ✗  sets the correct name
  | Error: 500 == 200 'Actual-User' == 'Expected-User'
  |     at sets the correct name (/Users/zavr/idiocc/http/example/test/spec/constructor.js:54:8)

example/test/spec/constructor.js > sets the correct name
  Error: 500 == 200 'Actual-User' == 'Expected-User'
      at sets the correct name (/Users/zavr/idiocc/http/example/test/spec/constructor.js:54:8)

🦅  Executed 4 tests: 1 error.
```
</td></tr>
<tr><td>We expect the last test to fail because in the assertion method we specified that the user name should be different from the one that was passed in the options to the middleware. Other tests pass because there were no errors in the assertion middleware. It is always required to call <code>assert</code> on the context instance, because simply requesting data with <code>get</code> will not throw anything even if the status code was not 200.</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="25"></a></p>

### `startPlain(`<br/>&nbsp;&nbsp;`fn: (req: IncomingMessage, res: ServerResponse),`<br/>&nbsp;&nbsp;`secure: boolean=,`<br/>`): Tester`

Starts the server without wrapping the listener in handler that would set status `200` on success and status `500` on error, and automatically finish the request. This means that the listener must manually do those things. Any uncaught error will result in run-time errors which will be caught by _Zoroaster_'s error handling mechanism outside of the test scope, but ideally they should be dealt with by the developer. If the middleware did not end the request, the test will timeout and the request will be destroyed by the context.

<table>
<tr><th>Plain Listener Testing</th></tr>
<tr><td>

```js
import HttpContext from '@contexts/http'

/** @type {Object<string, (h: HttpContext)} */
const TS = {
  context: HttpContext,
  async 'sets the status code and body'({ startPlain }) {
    await startPlain((req, res) => {
      res.statusCode = 200
      res.end('Hello World')
    })
      .get('/')
      .assert(200, 'Hello World')
  },
  async 'throws an error'({ startPlain }) {
    await startPlain(() => {
      throw new Error('Unhandled error.')
    })
      .get('/')
  },
  async 'times out'({ startPlain }) {
    await startPlain((req, res) => {
      res.write('hello')
    })
      .get('/')
  },
}

/** @type {Object<string, (h: HttpContext)} */
export const handled = {
  context: [class {
    c(listener) {
      return (req, res) => {
        try {
          listener(req, res)
        } catch (err) {
          res.statusCode = 500
        } finally {
          res.end()
        }
      }
    }
  }, HttpContext],
  async 'throws an error'({ c }, { startPlain }) {
    await startPlain(c(() => {
      throw new Error('Unhandled error.')
    }))
      .get('/')
      .assert(500)
  },
  async 'times out'({ c }, { startPlain }) {
    await startPlain(c((req, res) => {
      res.write('hello')
    }))
      .get('/')
      .assert(200, 'hello')
  },
}

export default TS
```
</td></tr>
<tr><td>With plain listener testing, the developer can test the function as if it was used on the server without any other middleware, such as error handling or automatic finishing of requests. The listener can also be wrapped in a custom service middleware will do those things to support testing.</td></tr>
<tr><td>

```
example/test/spec/plain.js
  ✓  sets the status code and body
  ✗  throws an error
  | Error: Unhandled error.
  |     at startPlain (/Users/zavr/idiocc/http/example/test/spec/plain.js:16:13)
  |     at Server.handler (/Users/zavr/idiocc/http/src/index.js:174:15)
  ✗  times out
  | Error: Test has timed out after 200ms
   handled
    ✓  throws an error
    ✓  times out

example/test/spec/plain.js > throws an error
  Error: Unhandled error.
      at startPlain (/Users/zavr/idiocc/http/example/test/spec/plain.js:16:13)
      at Server.handler (/Users/zavr/idiocc/http/src/index.js:174:15)

example/test/spec/plain.js > times out
  Error: Test has timed out after 200ms

🦅  Executed 5 tests: 2 errors.
```
</td></tr>
<tr><td>The tests with listeners which did not handle errors with fail, so will the tests with listeners that did not end the request. The second test suite, <code>handled</code> will wrap the plain listener in another listener that will always close the connection and also catch errors, setting the status code to <code>500</code>. It is similar to the <code>start</code> method, but allows to implement the custom handler.</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true" width="25"></a></p>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true"></a></p>

## Extending

The package was designed to be extended with custom assertions which are easily documented for use in tests. The only thing required is to import the _Tester_ class, and extend it, following a few simple rules.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/7.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>