```### start => Tester
[
  ["fn", "(req: IncomingMessage, res: ServerResponse)"],
  ["secure", "boolean="]
]
```

Starts the server with the given request listener function. It will setup an upper layer over the listener to try it and catch any errors in it. If there were errors, the status code will be set to `500` and the response will be ended with the error message. If there was no error, the status code will be set by _Node.JS_ to `200` automatically, if the request listener didn't set it. This is done so that assertion methods can be called inside of the supplied function. If the server needs to be started without the wrapper handler, the [`startPlain`](#startplainfn-req-incomingmessage-res-serverresponsesecure-boolean-tester) method can be used instead.

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

We expected the last test to fail because in the assertion method we specified that the user name should be different from the one that was passed in the options to the middleware. Other tests pass because there were no errors in the assertion middleware. It is always required to call `assert` on the context instance, because simply requesting data with `get` will not throw anything even if the status code was not _200_.
</md2html></td></tr>
<!-- /block-end -->
</table>

%~ width="25"%