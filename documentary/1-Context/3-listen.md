```### startPlain => Tester
[
  ["fn", "(req: IncomingMessage, res: ServerResponse)"],
  ["secure", "boolean="]
]
```

Starts the server without wrapping the listener in handler that would set status `200` on success and status `500` on error, and automatically finish the request. This means that the listener must manually do those things. Any uncaught error will result in run-time errors which will be caught by _Zoroaster_'s error handling mechanism outside of the test scope, but ideally they should be dealt with by the developer. If the middleware did not end the request, the test will timeout and the request will be destroyed by the context.

<table>
<tr><th>Plain Listener Testing</th><th>Wrapper Listener Testing</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/plain/plain, ../../../../src => @contexts/http%
</td>
<td>

%EXAMPLE: example/test/spec/plain/default, ../../../../src => @contexts/http%
</td></tr>
<tr><td colspan="2"><md2html>

With plain listener testing, the developer can test the function as if it was used on the server without any other middleware, such as error handling or automatic finishing of requests. The listener can also be wrapped in a custom service middleware that will do those things to support testing.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td colspan="2">

%FORK node_modules/.bin/zoroaster example/test/spec/plain -a -t 200%
</td></tr>
<tr><td colspan="2"><md2html>

The output shows how tests with listeners which did not handle errors fail, so did the tests with listeners that did not end the request. The `handled` test suite (on the right above), wraps the plain listener in another listener that always closed the connection and caught errors, setting the status code to `500`, so that all tests passed there. The strategy is similar to the `start` method, but allows to implement the custom handler.
</md2html></td></tr>
<!-- /block-end -->
</table>

%~ width="25"%