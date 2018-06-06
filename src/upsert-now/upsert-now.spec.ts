import {XSetupForTestNow} from '../test-helpers/setup';
import {XUpsertNow} from './upsert-now';

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
});