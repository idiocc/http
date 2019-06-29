```### session => Tester
```

Turns the session mode on. In the session mode, the cookies received from the server will be stored in the internal variable, and sent along with each following request. If the server removed the cookies by setting them to an empty string, or by setting the expiry date to be in the past, they will be removed from the tester and not sent to the server.

This feature can also be switched on by setting `session=true` on the context itself, so that `.session()` calls are not required.

Additional cookies can be set using the `.set('Cookie', {value})` method, and they will be concatenated to the cookies maintained by the session.

At the moment, only `expire` property is handled, without the `path`, or `httpOnly` directives. This will be added in future versions.

<table>
<tr><th colspan="2">session()</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: test/spec/session%
</td>
</tr>
<tr><td colspan="2">

<details><summary>
Show <em>Zoroaster</em> output
</summary>

%FORK node_modules/.bin/zoroaster test/spec/session.js -a%
</details>
</td></tr>
</table>