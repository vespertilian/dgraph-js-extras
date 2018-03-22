#### DGraph JS Extras


A library of helper functions to accompany the dgraph-js library. **Currently in an ALPHA state could break at any point**

Functions with the postfix "now" indicate they are transactions or operations and can be awaited.

Other operations like JS set return a mutation that needs to be used in conjunction with a transaction.


## Workflow

1. Make changes
1. Commit those changes `npm run commit`
1. Test `npm run test`
1. Bump version in `package.json`
1. Generate changelog `npm run generate-changelog`
1. Commit `package.json` and `CHANGELOG.md` files
1. Git tag - needed by changelog to know what version to attribute the commits to
1. Push