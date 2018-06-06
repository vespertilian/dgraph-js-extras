import {XSetupForTestNow} from '../test-helpers/setup';
import {XSetupWithSchemaDataNow} from '../test-helpers/setup';
import {queryFnReturnValues, XUpsertNow} from './upsert-now';

describe('XUpsertNow', () => {
    it('should rethrow any errors from the query function', async() => {

        const {dgraphClient} = await XSetupForTestNow();
        const data = {
            name: 'cameron'
        };

        const errorFn = (node: any) => { throw new Error(`Thrown error: ${JSON.stringify(node)}`)};

        let error = null;
        try {
            await XUpsertNow(errorFn, data, dgraphClient)
        } catch (e) {
            error = e
        }

        const expectedError = new Error(`Thrown error: {"name":"cameron"}`);
        expect(error).toEqual(expectedError);
    });

    it('should provide extra context when the dgraphQuery provided fails', async() => {

        const schema = `
            name: string @index(hash) . 
        `;
        const data = {
            name: 'cameron'
        };

        const {dgraphClient} = await XSetupWithSchemaDataNow({schema, data});

        const badQuery = (name: string) => (): queryFnReturnValues => {
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
            await XUpsertNow(badQuery("cameron"), {}, dgraphClient)
        } catch (e) {
            error = e;
        }

        expect(error.message).toContain('XUpsert DgraphQuery failed, check the query your provided against this error:')
    })
});