## 17 July 2019

### [1.5.1](https://github.com/idiocc/http/compare/v1.5.0...v1.5.1)

- [fix] Send binary data using the form (avoid converting to strings).

## 5 July 2019

### [1.5.0](https://github.com/idiocc/http/compare/v1.4.0...v1.5.0)

- [feature] Implement `post` and `postForm` requests.

## 29 June 2019

### [1.4.0](https://github.com/idiocc/http/compare/v1.3.0...v1.4.0)

- [feature] Initial support for sessions (without `path`).
- [fix] Correctly compare an empty body (`''`) in the assertion method which was skipped previously.
- [doc] Doc cookies better, with `.name` and examples.

## 28 June 2019

### [1.3.0](https://github.com/idiocc/http/compare/v1.2.8...v1.3.0)

- [fix/feature] Async _set_ that accepts a function.
- [feature] The `name` method of the Cookie Tester to test the presence of a cookie.
- [fix] Reset cookies state between the calls with the `reset` method.

## 27 June 2019

### [1.2.8](https://github.com/idiocc/http/compare/v1.2.7...v1.2.8)

- [jsdoc] Import `@rqt/aqt` return type in cookies.

### [1.2.7](https://github.com/idiocc/http/compare/v1.2.6...v1.2.7)

- [build] Upgrade `alamode` for cleaner build.

## 12 May 2019

### [1.2.6](https://github.com/idiocc/http/compare/v1.2.5...v1.2.6)

- [jsdoc] Combine files to prevent going deeper than 1 level.

### [1.2.5](https://github.com/idiocc/http/compare/v1.2.4...v1.2.5)

- [jsdoc] Build without `ln`.

### [1.2.4](https://github.com/idiocc/http/compare/v1.2.3...v1.2.4)

- [jsdoc] Fix JSDoc 🤞.

### [1.2.3](https://github.com/idiocc/http/compare/v1.2.2...v1.2.3)

- [jsdoc] Try fix JSDoc.

### [1.2.2](https://github.com/idiocc/http/compare/v1.2.1...v1.2.2)

- [jsdoc] Try fix JSDoc for Cookie Tester.

## 11 May 2019

### [1.2.1](https://github.com/idiocc/http/compare/v1.2.0...v1.2.1)

- [fix] Override the `startPlain` method, better cookies error messages.

## 10 May 2019

### [1.2.0](https://github.com/idiocc/http/compare/v1.1.0...v1.2.0)

- [feature] Assert headers by regular expression, better header diffing in error info.

### [1.1.0](https://github.com/idiocc/http/compare/v1.0.3...v1.1.0)

- [feature] Send `HEAD` requests.

### [1.0.3](https://github.com/idiocc/http/compare/v1.0.2...v1.0.3)

- [jsdoc-fix] Reference the `aqt.Return` import` from the index file to make it work in the _Tester_.

### [1.0.2](https://github.com/idiocc/http/compare/v1.0.1...v1.0.2)

- [fix] Don't override the status code in the `start` method.

### [1.0.1](https://github.com/idiocc/http/compare/v1.0.0...v1.0.1)

- [jsdoc-fix] Put files in the `index.js` to enable JSDoc.

## 9 May 2019

### [1.0.0](https://github.com/idiocc/http/compare/v0.0.0-pre...v1.0.0)

- [package] Publish `v1.0.0` of the package.

## 7 May 2019

### 0.0.0-pre

- Create `@contexts/http` with _[`My New Package`](https://mnpjs.org)_
- [repository]: `src`, [`test`](https://contexttesting.com), [`documentary`](https://readme.page) & [`types`](https://typedef.page).