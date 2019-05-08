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
  * [`start(fn: (req: IncomingMessage, res: ServerResponse), secure: boolean=): Tester`](#startfn-req-incomingmessage-res-serverresponsesecure-boolean-tester)
  * [`startPlain(fn: (req: IncomingMessage, res: ServerResponse), secure: boolean=): Tester`](#startplainfn-req-incomingmessage-res-serverresponsesecure-boolean-tester)
  * [`listen(server: http.Server|https.Server): Tester`](#listenserver-httpserverhttpsserver-tester)
- [class Tester](#class-tester)
  * [`get(path: string=): Tester`](#getpath-string-tester)
  * [`assert(code: number, body: (string|RegExp|Object)=): Tester`](#assertcode-numberbody-stringregexpobject-tester)
  * [`assert(header: string, value: ?string): Tester`](#assertheader-stringvalue-string-tester)
  * [`assert(assertion: function(ServerResponse)): Tester`](#assertassertion-functionserverresponse-tester)
  * [`set(header: string, value: string): Tester`](#setheader-stringvalue-string-tester)
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

<img src="aty/2.gif" alt="Writing Tests With HttpContext">
</td></tr>
<tr><td>The tests are written for <em>Zoroaster</em> in such a way that test suite objects are exported. When the <code>context</code> property is found on the test suite, it will be instantiated for all inner tests. The <code>start</code> method will wrap the request listener in try-catch block to send statuses <em>200</em> and <em>500</em> accordingly (see below).
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



### `start(`<br/>&nbsp;&nbsp;`fn: (req: IncomingMessage, res: ServerResponse),`<br/>&nbsp;&nbsp;`secure: boolean=,`<br/>`): Tester`

Starts the server with the given request listener function. It will setup an upper layer over the listener to try it and catch any errors in it. If there were errors, the status code will be set to `500` and the response will be ended with the error message. Otherwise, the status is set to `200`. This is done so that assertion methods can be called inside of the supplied function. If the server needs to be started without the wrapper handler, the [`startPlain`](#startplainfn-req-incomingmessage-res-serverresponsesecure-boolean-tester) method can be used instead.

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
<tr><td>We expected the last test to fail because in the assertion method we specified that the user name should be different from the one that was passed in the options to the middleware. Other tests pass because there were no errors in the assertion middleware. It is always required to call <code>assert</code> on the context instance, because simply requesting data with <code>get</code> will not throw anything even if the status code was not <em>200</em>.</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="25"></a></p>

### `startPlain(`<br/>&nbsp;&nbsp;`fn: (req: IncomingMessage, res: ServerResponse),`<br/>&nbsp;&nbsp;`secure: boolean=,`<br/>`): Tester`

Starts the server without wrapping the listener in the handler that would set status `200` on success and status `500` on error, and automatically finish the request. This means that the listener must manually do these things. Any uncaught error will result in run-time errors which will be caught by _Zoroaster_'s error handling mechanism outside of the test scope, but ideally they should be dealt with by the developer. If the middleware did not end the request, the test will timeout and the connection will be destroyed by the context to close the request.

<table>
<tr><th>Plain Listener Testing</th><th>Wrapper Listener Testing</th></tr>
<tr><td>

```js
import Http from '@contexts/http'

/** @type {Object<string, (h: Http)} */
const TS = {
  context: Http,
  async 'sets the status code and body'(
    { startPlain }) {
    await startPlain((req, res) => {
      res.statusCode = 200
      res.end('Hello World')
    })
      .get('/')
      .assert(200, 'Hello World')
  },
  // expect to fail with global error
  async 'throws an error'({ startPlain }) {
    await startPlain(() => {
      throw new Error('Unhandled error.')
    })
      .get('/')
  },
  // expect to timeout
  async 'does not finish the request'(
    { startPlain }) {
    await startPlain((req, res) => {
      res.write('hello')
    })
      .get('/')
  },
}

export default TS
```
</td>
<td>

```js
class C {
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
}

/** @type {Object<string, (c:C, h: Http)} */
export const handled = {
  context: [C, Http],
  async 'throws an error'({ c },
    { startPlain }) {
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
```
</td></tr>
<tr><td colspan="2">With plain listener testing, the developer can test the function as if it was used on the server without any other middleware, such as error handling or automatic finishing of requests. The listener can also be wrapped in a custom service middleware that will do these admin things to support testing.</td></tr>
<tr><td colspan="2">

```
example/test/spec/plain
   handled
    ✓  throws an error
    ✓  times out
   plain
    ✓  sets the status code and body
    ✗  throws an error
    | Error: Unhandled error.
    |     at startPlain (/Users/zavr/idiocc/http/example/test/spec/plain/plain.js:18:13)
    |     at Server.handler (/Users/zavr/idiocc/http/src/index.js:72:15)
    ✗  does not finish the request
    | Error: Test has timed out after 200ms

example/test/spec/plain > plain > throws an error
  Error: Unhandled error.
      at startPlain (/Users/zavr/idiocc/http/example/test/spec/plain/plain.js:18:13)
      at Server.handler (/Users/zavr/idiocc/http/src/index.js:72:15)

example/test/spec/plain > plain > does not finish the request
  Error: Test has timed out after 200ms

🦅  Executed 5 tests: 2 errors.
```
</td></tr>
<tr><td colspan="2">The output shows how tests with listeners that did not handle errors fail, so did the tests with listeners that did not end the request. The <code>handled</code> test suite (on the right above), wraps the plain listener in a middleware that closed the connection and caught errors, setting the status code to <code>500</code>, therefore all tests passed there. The strategy is similar to the <code>start</code> method, but allows to implement a custom handler.</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="25"></a></p>

### `listen(`<br/>&nbsp;&nbsp;`server: http.Server|https.Server,`<br/>`): Tester`

Starts the given server by calling the `listen` method. This method is used to test apps such as `Koa`, `Express`, `Connect` _etc_, or many middleware chained together, therefore it's a higher level of testing aka integration testing that does not allow to access the `response` object because no middleware is inserted into the server itself. It only allows to open URLs and assert on the results received by the request library, such as status codes, body and the headers. The server will be closed by the end of each test by the context.

<table>
<tr><th colspan="2">Server (App) Testing</th></tr>
<tr><td>

```js
import { createServer } from 'http'
import connect from 'connect'

const app = connect()
app.use((req, res, next) => {
  if (req.url == '/error')
    throw new Error('Uncaught error')
  res.write('hello, ')
  next()
})
app.use((req, res) => {
  res.statusCode = 200
  res.end('world!')
})

export default createServer(app)
```
</td>
<td>

```js
import H from '@contexts/http'
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
```
</td></tr>
<tr><td colspan="2">When a server needs to be tested as a whole of its middleware, the <code>listen</code> method of the <em>HttpContext</em> is used. It allows to start the server on a random port, navigate to pages served by it, and assert on the results.</td></tr>
<tr><td colspan="2">

```
example/test/spec/listen.js
  ✓  access the server
  ✓  connect catches errors

🦅  Executed 2 tests.
```
</td></tr>
<tr><td colspan="2">The tests will be run as usual, but if there were any errors, they will be either handled by the server library, or caught by <em>Zoroaster</em> as global errors. Any unended requests will result in the test timing out.</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## class Tester

The instance of a _Tester_ class is returned by the `start`, `startPlain` and `listen` methods. It is used to chain the actions together and extends the promise that should be awaited for during the test. It provides a testing API similar to the _SuperTest_ package, but does not require calling `done` method, because the _Tester_ class extends the _Promise_.


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true" width="25"></a></p>

### `get(`<br/>&nbsp;&nbsp;`path: string=,`<br/>`): Tester`

Navigate to the path and store the result status code, body and headers in an internal state, used for assertions later using the `assert` method.

<table>
<tr><th colspan="2">get(path?)</th></tr>
<tr><td>

```js
async 'redirects to /'({ start }) {
  await start(middleware)
    .get()
    .assert(302)
    .assert('location', 'index.html')
},
async 'opens sitemap'({ start }) {
  await start(middleware)
    .get('/sitemap')
    .assert(200)
},
```
</td>
<td>

```
example/test/spec/get.js
  ✓  redirects to /
  ✓  opens sitemap

🦅  Executed 2 tests.
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/7.svg?sanitize=true" width="25"></a></p>

### `assert(`<br/>&nbsp;&nbsp;`code: number,`<br/>&nbsp;&nbsp;`body: (string|RegExp|Object)=,`<br/>`): Tester`

Assert on the status code and body. The error message will contain the body if it was present. If the response was in JSON, it will be automatically parses by the request library, and the deep assertion will be performed.

<table>
<tr><th colspan="2">assert(code, body=)</th></tr>
<tr><td>

```js
async 'status code'({ startPlain }) {
  await startPlain((_, res) => {
    res.statusCode = 205
    res.end()
  })
    .get()
    .assert(205)
},
async 'status code with message'({ startPlain }) {
  await startPlain((_, res) => {
    res.statusCode = 205
    res.end('example')
  })
    .get('/sitemap')
    .assert(205, 'example')
},
async 'status code with regexp'({ startPlain }) {
  await startPlain((_, res) => {
    res.statusCode = 205
    res.end('Example')
  })
    .get('/sitemap')
    .assert(205, /example/i)
},
async 'status code with json'({ startPlain }) {
  await startPlain((_, res) => {
    res.statusCode = 205
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  })
    .get('/sitemap')
    .assert(205, { hello: 'world' })
},
```
</td>
<td>

```
example/test/spec/assert/code.js
  ✓  status code
  ✓  status code with message
  ✓  status code with regexp
  ✓  status code with json

🦅  Executed 4 tests.
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/8.svg?sanitize=true" width="25"></a></p>

### `assert(`<br/>&nbsp;&nbsp;`header: string,`<br/>&nbsp;&nbsp;`value: ?string,`<br/>`): Tester`

Assert on the response header. The value must be either a string, or null to assert that the header was not set.

<table>
<tr><th colspan="2">assert(header, ?value)</th></tr>
<tr><td>

```js
async 'header'({ startPlain }) {
  await startPlain((_, res) => {
    res.statusCode = 205
    res.setHeader('content-type', 'application/json')
    res.end('[]')
  })
    .get('/sitemap')
    .assert(205)
    .assert('content-type', 'application/json')
},
async 'absence of a header'({ startPlain }) {
  await startPlain((_, res) => {
    res.end()
  })
    .get('/sitemap')
    .assert('content-type', null)
},
```
</td>
<td>

```
example/test/spec/assert/header.js
  ✓  header
  ✓  absence of a header

🦅  Executed 2 tests.
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/9.svg?sanitize=true" width="25"></a></p>

### `assert(`<br/>&nbsp;&nbsp;`assertion: function(ServerResponse),`<br/>`): Tester`

Perform an assertion using the function that will receive the response object set by the `setup` method, enriched with the `headers` field updated by the request library.

<table>
<tr><th colspan="2">assert(assertion)</th></tr>
<tr><td>

```js
async 'using a function'({ start }) {
  await start((_, res) => {
    res.statusCode = 205
    res.setHeader('content-type', 'application/xml')
    res.end()
  })
    .get('/sitemap')
    .assert((res) => {
      equal(res.headers['content-type'],
        'application/xml')
    })
},
```
</td>
<td>

```
example/test/spec/assert/function.js
  ✓  using a function

🦅  Executed 1 test.
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/10.svg?sanitize=true" width="25"></a></p>

### `set(`<br/>&nbsp;&nbsp;`header: string,`<br/>&nbsp;&nbsp;`value: string,`<br/>`): Tester`

Sets the outgoing headers. Must be called before the `get` method.

<table>
<tr><th colspan="2">set(header, value)</th></tr>
<tr><td>

```js
async 'sets the header'({ startPlain }) {
  await startPlain((req, res) => {
    if (req.headers['x-auth'] == 'token') {
      res.statusCode = 205
      res.end('hello')
    } else {
      res.statusCode = 403
      res.end('forbidden')
    }
  })
    .set('x-auth', 'token')
    .get()
    .assert(205)
},
```
</td>
<td>

```
example/test/spec/assert/set.js
  ✓  sets the header

🦅  Executed 1 test.
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/11.svg?sanitize=true" width="25"></a></p>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/12.svg?sanitize=true"></a></p>

## Extending

The package was designed to be extended with custom assertions which are easily documented for use in tests. The only thing required is to import the _Tester_ class, and extend it, following a few simple rules.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/13.svg?sanitize=true"></a></p>

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