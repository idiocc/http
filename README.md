# @idio/http

[![npm version](https://badge.fury.io/js/@idio/http.svg)](https://npmjs.org/package/@idio/http)

`@idio/http` is The Http(s) Testing Context For Super-Test Style Assertions. Includes Standard Assertions (get, set, assert), And Allows To Be Extended With JSDocumented Custom Assertions.

```sh
yarn add @idio/http
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`http(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`_@idio/http.Config`](#type-_@idio/httpconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import http from '@idio/http'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `http(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-_@idio/httpconfig">`_@idio/http.Config`</a>__: Options for the program.

|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| __text*__ | <em>string</em>  | A text to return. | -       |

```js
/* alanode example/ */
import http from '@idio/http'

(async () => {
  const res = await http({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Idio][1] 2019

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>