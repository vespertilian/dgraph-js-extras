import {xSetupForTest} from '../test-helpers/setup';
import {xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {IUpsertFnReturnValues, xUpsertCommitTxn} from './upsert';

describe('xUpsertCommitTxn', () => {
    it('rethrows any errors from the query function', async() => {

        const {dgraphClient} = await xSetupForTest();
        const data = {
            name: 'cameron'
        };

        const errorFn = (node: any) => { throw new Error(`Thrown error: ${JSON.stringify(node)}`)};

        let error = null;
        try {
            await xUpsertCommitTxn(errorFn, data, dgraphClient)
        } catch (e) {
            error = e
        }

        const expectedError = new Error(`Thrown error: {"name":"cameron"}`);
        expect(error).toEqual(expectedError);
    });

    it('provides extra context when the dgraphQuery provided fails', async() => {

        const schema = `
            name: string @index(hash) . 
        `;
        const data = {
            name: 'cameron'
        };

        const {dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema, data});

        const badQuery = (name: string) => (): IUpsertFnReturnValues => {
            // This query is missing parentheses around the name value
            const dgraphQuery = `{
                q(func: eq(name, "${name})) {
                    uid
                }
            }`;

            const nodeFoundFn: any = () => {};
            return {
                dgraphQuery,
                nodeFoundFn
            }
        };

        let error = null;
        try {
            await xUpsertCommitTxn(badQuery("cameron"), {}, dgraphClient)
        } catch (e) {
            error = e;
        }

        expect(error.message).toContain('xUpsert DgraphQuery failed, check the query you provided against this error:')
    })
});
