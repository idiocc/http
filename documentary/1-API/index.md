## API

The package is available by importing its default function:

```js
import HttpContext, { Tester } from '@contexts/http'
```

When [extending](#extending) the context, the `Tester` class also needs to be imported.

%~%

## class HttpContext

This testing context is to be used with [_Zoroaster Context Testing Framework_](https://contexttesting.com). Once it is defined as part of a test suite, it will be available to all inner tests via the arguments. It allows to specify the middleware function to start the server with, and provides an API to send requests, while setting headers, and then assert on the result that came back. It was inspired by `supertest`, but is asynchronous in nature so that no `done` has to be called &mdash; just the promise needs to be awaited on.

<table>
<tr><th><md2html>

Using _HttpContext_ Example</md2html></th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/src/index.js%
</td></tr>
<tr><td>
For example, we might want to test some synchronous middleware. It will check for the authentication token in the headers, reject the request if it is not present, or if the corresponding user is not found, and write the response if everything is OK.
</tr></td>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/default, ../../../src => @contexts/http%
</td></tr>
<tr><td><md2html>

The tests are written for _Zoroaster_ in such a way that test suite objects are exported. When the `context` property is found on the test suite, it will be instantiated for all inner tests.
</md2html>
</td></tr>
<!-- /block-end -->
<!-- block-end -->
<tr><td>

%FORK node_modules/.bin/zoroaster example/test/spec -a%
</td></tr>
<tr><td><md2html>

The tests can be run with _Zoroaster_ test runner: `zoroaster example/test/spec -a`.
</md2html>
</td></tr>
<!-- /block-end -->
</table>

%~ width="25"%

```### constructor
```

The constructor is not used manually, it will be called by _Zoroaster_ automatically.

%~ width="25"%

```### start => Tester
[
  ["fn", "(req: IncomingMessage, res: ServerResponse)"]
]
```

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

<table>
<tr><th>Middleware Constructor Testing Strategy</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/src/constructor%
</td></tr>
<tr><td><md2html>

We update the source code to export a constructor of middleware, based on the given options. In this case, the middleware will be created with the `users` object that is scoped within the function, rather that file, so that we can pass it at the point of creating the middleware.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/constructor.js, ../../../src => @contexts/http%
</td></tr>
<tr><td><md2html>

The new tests require implementing a method that will call the middleware constructor prior to continuing with the request. This method is creates as part of a different context, called simply _Context_. It will help to create the request listener to pass to the `start` method, where the assertions will be written in another middleware executed after the source code one.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%FORK node_modules/.bin/zoroaster example/test/spec/constructor.js -a%
</td></tr>
<tr><td><md2html>

We expect the last test to fail because in the assertion method we specified that the user name should be different from the one that was passed in the options to the middleware. Other tests pass because there were no errors in the assertion middleware. It is always required to call `assert` on the context instance, because simply requesting data with `get` will not throw anything even if the status code was not 200.
</md2html></td></tr>
<!-- /block-end -->
</table>

<!-- %TYPEDEF types/index.xml%

%EXAMPLE: example, ../src => @idio/http%
%FORK example% -->

%~%