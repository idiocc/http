## Extending

The package was designed to be extended with custom assertions which are easily documented for use in tests. The only thing required is to import the _Tester_ class, and extend it, following a few simple rules.

There are 2 parts of the _@contexts/Http_ software: the context and the tester. The context is used to start the server, remember the response object as well as to destroy the server. The tester is what is returned by the `start/startPlain/listen` methods, and is used to query the server. To implement the custom assertions with support for JSDoc, the context need to be extended to include any private methods that could be used by the tester's assertions, but might not have to be part of the _Tester_ API, and then implement those assertions in the tester by calling the private `_addLink` method which will add the action to the promise chain, so that the `await` syntax is available.

<table>
<tr><th>Implementing Custom Assertions For Cookies</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/context/Context%
</td></tr>
<tr><td><md2html>

The _Cookies_ context should extend the _Http_ context, and set `this.TesterConstructor = CookieTester` in its constructor, so that the `start/startPlain/listen` methods of the superclass will construct the appropriate tester. The additional step involved is overriding the `start` method to update the JSDoc type of the tester returned to `CookieTester` so that the autocompletion hints are available in tests. Now, additional methods that are required for assertions, can be added to the context. They will be accessible via the `this.context` in the tester as shown below. The tester itself is accessible via the `this.tester`, and the AQT response object can be accessed via the `this.tester.res` property.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%EXAMPLE: example/context/CookieTester%
</td></tr>
<tr><td><md2html>

The _CookieTester_ class allows to add the assertions to the tester. To help write assertions, the `this.context` type need to be updated to the `/** @type {import('./Context').default} */ this.context = null` in the constructor. Each assertion is documented with standard JSDoc. The assertion method might want to create an `erotic` object at first, to remember the point of entry to the function, so that the assertion will fail with an error whose stack consists of a single line where the assertion is called. This `e` object will have to be passed as the second argument to the `this._addLink` method. The assertion logic, either sync or async must be implemented withing the callback passed to the `this_addLink` method that will update the chain and execute the assertion in its turn. If the assertion explicitly returns `false`, no other assertions in the chain will be called.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

<img src="aty/jsdoc.gif" alt="Writing JSDoc Enabled Assertions">
</td></tr>
<tr><td><md2html>

Now the _CookieTester_ methods which are used in tests, will come up with JSDoc documentation. The context must be imported as usual from the `context` directory, and setup on test suites in the `context` property.
</md2html></td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td>

%FORK node_modules/.bin/zoroaster example/test/spec/cookie/ -a%
</td></tr>
<tr><td><md2html>

Because we used `erotic`, the test will fail at the line of where the assertion method was called. It is useful for async assertions, which otherwise would not have any useful information in the error stack, and only point to the internal lines in the _CookieTester_, but not the test suite.
</md2html></td></tr>
<!-- /block-end -->
</table>

%~%