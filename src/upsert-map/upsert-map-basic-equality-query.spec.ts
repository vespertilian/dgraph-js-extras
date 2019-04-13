import {IUidMap, xUpsertMapTxn} from './upsert-map';
import {getUids} from '../test-helpers/get-uids';
import {xSetupWithSchemaDataNowTxn} from '../test-helpers/setup';
import {basicEqualityUpsertFn} from '../upsert/upsert-fns/basic-equality-upsert-fn';

describe('xUpsertMapTxn with basic equality query', () => {
    it('allows you to pass a mapped object of upserts and return the map with created or found uids', async() => {
        // xSetupForTestNow
        const schema = `
           name: string @index(fulltext) .
           email: string @index(exact) @upsert .
        `;

        const cameron = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        const helena = {
            name: 'Helena',
            email: 'h@gmail.com'
        };

        const barbara = {
            name: 'Barbara',
            email: 'b@gmail.com'
        };

        const {dgraphClient, result} = await xSetupWithSchemaDataNowTxn({schema, data: [cameron, helena, barbara]});
        const [cameronUid] = getUids({numberOfIdsToGet: 1, result});

        const map = {
            howard: {
                name: 'Howard',
                email: 'hb@gmail.com'
            },
            cameron: {
                name: 'Cameron B',
                email: 'cam@gmail.com'
            }
        };

        const resultMap = await xUpsertMapTxn(basicEqualityUpsertFn('email'), map, dgraphClient);

        const expectedResult: IUidMap = {
            cameron: cameronUid,
            howard: jasmine.anything() as any
        };

        expect(resultMap).toEqual(expectedResult);
    });

    it('throws an error highlighting why an update failed', async() => {
        const schema = `
                name: string @index(fulltext) .
                email: string @index(hash) @upsert .
            `;

        const cameron = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        const helena1 = {
            name: 'Helena 1',
            email: 'h@gmail.com'
        };

        const helena2 = {
            name: 'Helena 2',
            email: 'h@gmail.com'
        };

        const barbara = {
            name: 'Barbara',
            email: 'b@gmail.com'
        };

        const {dgraphClient} = await xSetupWithSchemaDataNowTxn({schema, data: [cameron, helena1, helena2, barbara]});

        const uidMap = {
            helenaUpdate: {
                name: 'Real Helena',
                email: 'h@gmail.com'
            }
        };

        let error: Error | null = null;
        try {
            await xUpsertMapTxn(basicEqualityUpsertFn('email'), uidMap, dgraphClient);
        } catch (e) {
            error = e
        }

        const expectedError = new Error(`
                    More than one node matches "h@gmail.com" for the "email" predicate.
                    Aborting xUpsertNow. 
                    Delete the extra values before tyring xUpsert again.`);
        expect(expectedError).toEqual(error)
    })
});
