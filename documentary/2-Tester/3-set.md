```### set => Tester
[
  ["header", "string"],
  ["value", "string"]
]
```

Sets the outgoing headers. Must be called before the `get` method. It is possible to remember the result of the first request using the `assert` method by storing it in a variable, and then use it for headers in the second request (see example).

<table>
<tr><th colspan="2">set(header, value)</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/test/spec/assert/set%
</td>
<td>

%EXAMPLE: example/test/spec/assert/set-fn%
</td></tr>
<tr><td colspan="2">

<details><summary>
Show <em>Zoroaster</em> output
</summary>

%FORK node_modules/.bin/zoroaster example/test/spec/assert/set.js example/test/spec/assert/set-fn.js -a%
</details>
</td></tr>
</table>