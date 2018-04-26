<a name="0.4.0"></a>
# [0.4.0](https://github.com/vespertilian/dgraph-js-extras/compare/v0.3.3...v0.4.0) (2018-04-09)


### Features

* **create-client:** rename log port to log address to be more descriptive ([5d9e609](https://github.com/vespertilian/dgraph-js-extras/commit/5d9e609))


### BREAKING CHANGES

* **create-client:** option name has changed logPort is now logAddress



<a name="0.3.3"></a>
## [0.3.3](https://github.com/vespertilian/dgraph-js-extras/compare/v0.3.2...v0.3.3) (2018-04-09)


### Features

* **create-client:** add an option to log the host and port without having to be in debug mode ([0ad72e5](https://github.com/vespertilian/dgraph-js-extras/commit/0ad72e5))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/vespertilian/dgraph-js-extras/compare/v0.3.1...v0.3.2) (2018-03-27)


### Features

* **extract-uids:** improve error messaging ([bb0b087](https://github.com/vespertilian/dgraph-js-extras/commit/bb0b087))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/vespertilian/dgraph-js-extras/compare/v0.3.0...v0.3.1) (2018-03-27)


### Bug Fixes

* **extract-uids:** added a better isPromise check ([e02b328](https://github.com/vespertilian/dgraph-js-extras/commit/e02b328))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/vespertilian/dgraph-js-extras/compare/v0.2.1...v0.3.0) (2018-03-26)


### Features

* **extract-uids:** XExtractFirstUid now returns a string not a string array ([0ea4245](https://github.com/vespertilian/dgraph-js-extras/commit/0ea4245))


### BREAKING CHANGES

* **extract-uids:** XExtractFirstUid now returns a string not a string array



<a name="0.2.1"></a>
## [0.2.1](https://github.com/vespertilian/dgraph-js-extras/compare/v0.2.0...v0.2.1) (2018-03-26)


### Features

* **extract-uids:** added an extract uids function that can take an XSetJSONNow Promise or Result an ([5f88880](https://github.com/vespertilian/dgraph-js-extras/commit/5f88880))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.8...v0.2.0) (2018-03-23)


### Code Refactoring

* **js-set-now set-json-now:** renaming js-set-now and associated functions to be more inline wi ([f7db9d4](https://github.com/vespertilian/dgraph-js-extras/commit/f7db9d4))


### BREAKING CHANGES

* **js-set-now set-json-now:** XSetJs has been renamed XSetJSON and XTRXSetJSNow has
been renamed XSetJSONNow



<a name="0.1.8"></a>
## [0.1.8](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.7...v0.1.8) (2018-03-22)


### Features

* **test-helpers:** move test helpers into main library and expose them for use by the client code b ([f750576](https://github.com/vespertilian/dgraph-js-extras/commit/f750576))



<a name="0.1.7"></a>
## [0.1.7](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.6...v0.1.7) (2018-02-24)


### Features

* **index:** export XUpsertMapNow from index for convenience ([7779adb](https://github.com/vespertilian/dgraph-js-extras/commit/7779adb))
* **upsert-map-now:** add upsert-map-now which allows you to provide a map of values and receive the uids mapped back on the original maps keys ([69f92af](https://github.com/vespertilian/dgraph-js-extras/commit/69f92af))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.5...v0.1.6) (2018-02-21)


### Features

* **upsert-now:** add more context when upsert fails because it cannot created nested objects ([36266a4](https://github.com/vespertilian/dgraph-js-extras/commit/36266a4))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.4...v0.1.5) (2018-02-21)


### Features

* **upsert-now:** add a spec checking that you can link nodes when upserting ([cd3f57d](https://github.com/vespertilian/dgraph-js-extras/commit/cd3f57d))
* **upsert-now:** upsert now returns uid ([f54d23c](https://github.com/vespertilian/dgraph-js-extras/commit/f54d23c))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.2...v0.1.4) (2018-02-16)


### Bug Fixes

* **package.json:** add a preoublishOnly step that builds the repository before publishing ([4f7642b](https://github.com/vespertilian/dgraph-js-extras/commit/4f7642b))


### Features

* **upsert-now:** remove the requirement for the upsert search predicates to be strings ([1a41cd8](https://github.com/vespertilian/dgraph-js-extras/commit/1a41cd8))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.1...v0.1.2) (2018-02-16)


### Features

* **index:** export specific types to hopefully get better typecompletion ([dee2190](https://github.com/vespertilian/dgraph-js-extras/commit/dee2190))
* **upsert-now:** upsert now works for multiple search predicates ([a0cde5d](https://github.com/vespertilian/dgraph-js-extras/commit/a0cde5d))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/vespertilian/dgraph-js-extras/compare/v0.1.0...v0.1.1) (2018-02-16)


### Features

* **src/.:** refator to include "now" naming convention ([c6a1f8d](https://github.com/vespertilian/dgraph-js-extras/commit/c6a1f8d))
* **upsert-now:** refactored upsert to allow an array of search predicates ([2909882](https://github.com/vespertilian/dgraph-js-extras/commit/2909882))
* **upsert-now:** rename find-or-create to upsert-now and add typings to package.json so the typescript tooling can find the types ([64cc3fc](https://github.com/vespertilian/dgraph-js-extras/commit/64cc3fc))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/vespertilian/dgraph-js-extras/compare/09b1971...v0.1.0) (2018-02-15)


### Features

* **create-client:** created a create client function with tests ([09b1971](https://github.com/vespertilian/dgraph-js-extras/commit/09b1971))
* **find-or-create:** created a dgraph upsert helper ([679da06](https://github.com/vespertilian/dgraph-js-extras/commit/679da06))
* **find-or-create:** upsert now works with arrays ([5f2c1e0](https://github.com/vespertilian/dgraph-js-extras/commit/5f2c1e0))
* **package.json:** update build script and publish v0.1.0 ([44caf88](https://github.com/vespertilian/dgraph-js-extras/commit/44caf88))


