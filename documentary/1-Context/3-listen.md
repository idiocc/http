```### listen => Tester
[
  ["server", "http.Server|https.Server"]
]
```

Starts the given server by calling the `listen` method. This method is used to test apps such as `Koa`, `Express`, `Connect` _etc_, or many middleware chained together, therefore it's a higher level of testing aka integration testing that does not allow to access the `response` object because no middleware is inserted into the server itself. It only allows to open URLs and assert on the results received by the request library, such as status codes, body and the headers. The server will be closed by the end of each test by the context.

<table>
<tr><th colspan="2">Server (App) Testing</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/src/server%
</td>
<td>

%EXAMPLE: example/test/spec/listen, ../../../src => @contexts/http%
</td></tr>
<tr><td colspan="2"><md2html>

When a server needs to be tested as a whole of its middleware, the `listen` method of the _HttpContext_ is used. It allows to start the server on a random port, navigate to pages served by it, and assert on the results.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td colspan="2">

%FORK node_modules/.bin/zoroaster example/test/spec/listen.js -a%
</td></tr>
<tr><td colspan="2"><md2html>

The tests will be run as usual, but if there were any errors, they will be either handled by the server library, or caught by _Zoroaster_ as global errors. Any unended requests will result in the test timing out.
</md2html></td></tr>
<!-- /block-end -->
</table>