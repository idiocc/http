## class Tester

The instance of a _Tester_ class is returned by the `start`, `startPlain` and `listen` methods. It is used to chain the actions together and extends the promise that should be awaited for during the test. It provides a testing API similar to the _SuperTest_ package, but does not require calling `done` method, because the _Tester_ class extends the _Promise_.


%~ width="25"%