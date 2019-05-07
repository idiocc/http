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

<img src="aty/1.gif" alt="Writing Tests With HttpContext">
<!-- %EXAMPLE: example/test/spec/default, ../../../src => @contexts/http% -->
</td></tr>
<tr><td><md2html>

The tests are written for _Zoroaster_ in such a way that test suite objects are exported. When the `context` property is found on the test suite, it will be instantiated for all inner tests. The `start` method will wrap the request listener in try-catch block to send statuses _200_ and _500_ accordingly (see below).
</md2html>
</td></tr>
<!-- /block-end -->
<!-- block-end -->
<tr><td>

%FORK node_modules/.bin/zoroaster example/test/spec/default.js -a%
</td></tr>
<tr><td><md2html>

The tests can be run with _Zoroaster_ test runner: `zoroaster example/test/spec -a`.
</md2html>
</td></tr>
<!-- /block-end -->
</table>

%~ width="25"%

<!-- ```### constructor
```

The constructor is not used manually, it will be called by _Zoroaster_ automatically.

%~ width="25"% -->
<!-- %TYPEDEF types/index.xml%

%EXAMPLE: example, ../src => @contexts/http%
%FORK example% -->

