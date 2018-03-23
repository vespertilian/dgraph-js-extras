#### DGraph JS Extras


A library of helper functions to accompany the dgraph-js library. **Currently in an ALPHA state could break at any point**

Functions with the postfix "now" indicate they are transactions or operations and can be awaited.

Other operations like JS set return a mutation that needs to be used in conjunction with a transaction.


## Workflow

1. Make changes
2. Commit those changes `yarn run commit`
3. Test `yarn run test`
4. Bump version in `package.json`
5. Generate changelog `yarn run generate-changelog`
6. Publish `yarn publish`
7. Commit `package.json`, `CHANGELOG.md` and lib files
8. Git tag - needed by changelog to know what version to attribute the commits to
9. Push