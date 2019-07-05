```### debug
[
  ["on", "boolean="]
]
```

Switches on the debugging for the `start` method, because it catches the error and sets the response to 500, without giving any info about the error. This will log the error that happened during assertions in the request listener. Useful to see at what point the request failed.

<table>
<tr><th>Debugging Errors In Start</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/debug, ../../../src => @contexts/http%
</td></tr>
<tr><td><md2html>

The debug is called once before the test. When called with `false`, it will be switched off, but that use case is probably not going to be ever used, since it's just to debug tests.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%/_FORK node_modules/.bin/zoroaster example/test/spec/debug.js -a%
</td></tr>
<tr><td><md2html>

The output normally fails with the error on the status code assertions, since the handler which wraps the request listener in the `start` methods, catches any errors and sets the response to be of status `500` and the body to the error message.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%_FORKERR node_modules/.bin/zoroaster example/test/spec/debug.js -a%
</td></tr>
<tr><td><md2html>

The `stderr` output, on the other hand, will now print the full error stack that lead to the error.
</md2html></td></tr>
<!-- /block-end -->
</table>