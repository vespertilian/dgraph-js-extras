# DGraph JS Extras

#### A library of helper functions to accompany the dgraph-js library.

- **0 dependencies** just `dgraph-js` and `grpc` are needed as peer dependencies.
- **100%** test coverage.
- Written in **Typescript** just like the DGraph library so you get IntelliSense.

Functions including "commit" indicate they will be set to "commitNow"
Functions including "txn" indicate they create their own transactions and can be directly awaited.

This library is pre 1.0 and there might be some small API changes, that said everything is a small function so you could always ctrl-c ctrl-v it out of the repo if things change. 

## Example: upsert helper function

```ts
const updateJunior = {
    skill: 'Javascript',
    level: 10,
    x: 'y',
    y: 'y',
    z: 'y'
};

// If you already had a node in the db that looks like:
const existingNode = {
    skill: 'Javascript',
    level: 10,
    x: 'foo',
    y: 'foo',
    z: 'foo'
};

// You can pass an array of values to update, or just an object.
const updates = [updateJunior];

// The basicEqualityUpsertFn below will find any nodes that has both skill and level predicates.
const upsertFn = basicEqualityUpsertFn(['skill', 'level']);

// x, y and z will be updated from 'foo' to 'y', because both skill and level match.

// If no node matched both skill 'Javascript' and level '10' a new node would be created.
// We can await this direclty as it includes commit and txn postfix. 
await xUpsertCommitTxn(upsertFn, updates, dgraphClient);

If you want it as part of a bigger transaction there is also a xUpsertObject function you could use. 
```

Checkout all the functions in [API documentation](https://vespertilian.github.io/dgraph-js-extras/index.html)


## Contribute?

Please do feel free to submit a PR.

#### Testing 

Install docker then run `yarn run dgraph-test-db-up`
Now just call `yarn run test`

You can also setup [Wallaby JS](https://wallabyjs.com) as a test runner. I am a fan. 

#### Deploy workflow

1. Make changes
2. Commit those changes `yarn run commit`
3. Test `yarn run test`
4. Bump version in `package.json`
5. Generate changelog `yarn run generate-changelog`
6. Publish `yarn publish`
7. Commit `package.json`, `CHANGELOG.md` and lib files
8. Git tag - needed by changelog to know what version to attribute the commits to
9. Push

