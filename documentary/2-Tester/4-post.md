```### post => Tester
[
  ["path", "string?"],
  ["data", "string|Object?"],
  ["options", "AqtOptions?"]
]
```

Posts data to the server. By default, a string will be sent with the `text/plain` _Content-Type_, whereas an object will be encoded as the `application/json` type, or it can be sent as `application/x-www-form-urlencoded` data by specifying `type: form` in options. To send `multipart/form-data` requests, use the `postForm` method.

<table>
<tr><th colspan="2"><a href="example/test/spec/assert/post.js">post(path, data?, options?)</a></th></tr>
<!-- block-start -->
<tr><td colspan="2">

%EXAMPLE: example/test/spec/assert/post%
</td>
</tr>
<tr><td colspan="2">

<details><summary>
Show <em>Zoroaster</em> output
</summary>

%/FORK node_modules/.bin/zoroaster example/test/spec/assert/post.js -a%
</details>
</td></tr>
</table>

%~ width="25"%