```### assert => Tester
[
  ["code", "number"],
  ["body", "(string|RegExp|Object)="]
]
```

Assert on the status code and body. The error message will contain the body if it was present. If the response was in JSON, it will be automatically parses by the request library, and the deep assertion will be performed.

<table>
<tr><th colspan="2">assert(code, body=)</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/assert/code%
</td>
<td>

%FORK node_modules/.bin/zoroaster example/test/spec/assert/code.js -a%
</td></tr>
</table>

%~ width="25"%

```### assert => Tester
[
  ["header", "string"],
  ["value", "?string"]
]
```

Assert on the response header. The value must be either a string, or null to assert that the header was not set.

<table>
<tr><th colspan="2">assert(header, ?value)</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/assert/header%
</td>
<td>

%FORK node_modules/.bin/zoroaster example/test/spec/assert/header.js -a%
</td></tr>
</table>

%~ width="25"%

```### assert => Tester
[
  ["assertion", "function(Aqt.Return)"]
]
```

Perform an assertion using the function that will receive the response object which is the result of the request operation with `aqt`. If the tester was started with `start` or `startPlain` methods, it is possible to get the  response object from the request listener by calling the `getResponse` method on the context.

%TYPEDEF node_modules/@rqt/aqt/types/return.xml%

<table>
<tr><th colspan="2">assert(assertion)</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/assert/function%
</td>
<td>

%FORK node_modules/.bin/zoroaster example/test/spec/assert/function.js -a%
</td></tr>
</table>

%~ width="25"%