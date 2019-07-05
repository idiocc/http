```### postForm => Tester
[
  ["path", "string?"],
  ["cb", "async function(Form)"],
  ["options", "AqtOptions?"]
]
```

Creates a form instance, to which data and files can be appended via the supplied callback, and sends the request as `multipart/form-data` to the server. See the [Form interface](https://github.com/idiocc/form#class-form) full documentation.

<table>
<tr><th colspan="2"><a href="example/test/spec/assert/post-form.js">postForm(path, cb, options?)</a></th></tr>
<!-- block-start -->
<tr><td colspan="2">

%EXAMPLE: example/test/spec/assert/post-form%
</td>
</tr>
<tr><td colspan="2">

<details><summary>
Show <em>Zoroaster</em> output
</summary>

%/FORK node_modules/.bin/zoroaster example/test/spec/assert/post-form.js -a%
</details>
</td></tr>
</table>

%~ width="25"%