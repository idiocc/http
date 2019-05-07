```### startPlain => Tester
[
  ["fn", "(req: IncomingMessage, res: ServerResponse)"],
  ["secure", "boolean="]
]
```

Starts the server without wrapping the listener in handler that would set status `200` on success and status `500` on error, and automatically finish the request. This means that the listener must manually do those things. Any uncaught error will result in run-time errors which will be caught by _Zoroaster_'s error handling mechanism outside of the test scope, but ideally they should be dealt with by the developer. If the middleware did not end the request, the test will timeout and the request will be destroyed by the context.

<table>
<tr><th colspan="2">Plain Listener Testing</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/plain/plain, ../../../../src => @contexts/http%
</td>
<td>

%EXAMPLE: example/test/spec/plain/default, ../../../../src => @contexts/http%
</td></tr>
<tr><td colspan="2"><md2html>

With plain listener testing, the developer can test the function as if it was used on the server without any other middleware, such as error handling or automatic finishing of requests. The listener can also be wrapped in a custom service middleware will do those things to support testing.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td colspan="2">

%FORK node_modules/.bin/zoroaster example/test/spec/plain -a -t 200%
</td></tr>
<tr><td colspan="2"><md2html>

The tests with listeners which did not handle errors with fail, so will the tests with listeners that did not end the request. The second test suite, `handled` will wrap the plain listener in another listener that will always close the connection and also catch errors, setting the status code to `500`. It is similar to the `start` method, but allows to implement the custom handler.
</md2html></td></tr>
<!-- /block-end -->
</table>

%~ width="25"%