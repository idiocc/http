# @idio/http

[![npm version](https://badge.fury.io/js/%40idio%2Fhttp.svg)](https://npmjs.org/package/@idio/http)

`@idio/http` is The Http(s) Testing Context For Super-Test Style Assertions. Includes Standard Assertions (get, set, assert), And Allows To Be Extended With JSDocumented Custom Assertions.

```sh
yarn add @idio/http
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class HttpContext](#class-httpcontext)
  * [`constructor()`](#constructor-void)
  * [`start(fn: (req: IncomingMessage, res: ServerResponse)): Tester`](#startfn-req-incomingmessage-res-serverresponse-tester)
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
example/test/spec
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

### `start(`<br/>&nbsp;&nbsp;`fn: (req: IncomingMessage, res: ServerResponse),`<br/>`): Tester`

Starts the server will the given middleware function. It will setup an upper layer over the middleware to try it and catch any errors in it. If there were any errors, the status code will be set to `500` and the response will be ended with the error message. This is done so that assertion methods can be called inside of the supplied function.

```js
// the handler installed by the `start` method.
const handler = async (req, res) => {
  try {
    this.response = res
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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Extending

The package was designed to be extended with custom assertions which are easily documented for use in tests. The only thing required is to import the _Tester_ class, and extend it, following a few simple rules.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

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