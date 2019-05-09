## CookiesContext

The _CookiesContext_ provides assertion methods on the `set-cookie` header returned by the server. It allows to check how many times cookies were set as well as what attributes and values they had.

- `count(number)`: Assert on the number of times the cookie was set.
- `value(name, value)`: Asserts on the value of the cookie.
- `attribute(name, attrib)`: Asserts on the presence of an attribute in the cookie.
- `attributeAndValue(name, attrib, value)`: Asserts on the value of the cookie's attribute.
- `noAttribute(name, attrib)`: Asserts on the absence of an attribute in the cookie.

The context was adapted from the work in https://github.com/pillarjs/cookies. See how [the tests are implemented](https://github.com/idiocc/cookies/blob/master/test/spec/set.js) for more info.

%~%