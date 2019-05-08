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
  ["assertion", "function(ServerResponse)"]
]
```

Perform an assertion using the function that will receive the response object set by the `setup` method, enriched with the `headers` field updated by the request library.

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