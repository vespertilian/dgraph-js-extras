import {setupWith} from '../test-helpers/setup';
import {XUpsertNow} from './find-or-create';

describe('XUpsertNow', () => {

    it('should throw an error if the key predicate is not a string value', async() => {
        const data = {
            name: 'cameron'
        };

        let error = null;
        try {
            await XUpsertNow('email', data, {} as any)
        } catch (e) {
           error = e
        }

        const expectedError = new Error(`
        The key predicate must be a searchable string value on the object you are creating.
        
        "email" does not exist as a string on:
        {"name":"cameron"}`);

        expect(error).toEqual(expectedError);
    });


    it('should find an overwrite a node if the node exists', async() => {
        // setup
        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
        `;

        const initialData = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        const {dgraphClient} = await setupWith({schema, data: initialData});

        //grab original
        const predicateNameQuery = `{
            q(func: has(name)) {
                uid
                name
                email
            }
        }`;

        const initialUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
        const [initialCameron] = initialUidQuery.getJson().q;

        // update cameron
        const data = {
            name: 'Cameron Batt',
            email: 'cam@gmail.com'
        };

        await XUpsertNow('email', data, dgraphClient);

        const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
        const [finalCameron, ...others] = finalUidQuery.getJson().q;
        expect(others).toEqual([]); // should only be 1 result

        expect(finalCameron.uid).toEqual(initialCameron.uid);
        expect(finalCameron.name).toEqual(data.name);
    });

    it('should create a new node if one does not exist', async() => {

        // setup
        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
        `;

        const cameron = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        const {dgraphClient} = await setupWith({schema, data: cameron});

        //grab original
        const predicateNameQuery = `{
            q(func: has(name)) {
                name
                email
            }
        }`;

        // add helena
        const helena = {
            name: 'Helena ',
            email: 'h@gmail.com'
        };

        await XUpsertNow('email', helena, dgraphClient);

        const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
        const users = finalUidQuery.getJson().q;
        expect(users).toEqual([cameron, helena]); // cameron and helena should both be present

    });

    it('should throw an error if you try to upsert and two nodes exist for the searched predicate', async() => {
        // setup
        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
        `;

        const cameronA = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        const cameronB = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        const {dgraphClient} = await setupWith({schema, data: [cameronA, cameronB]});

        const cameronC = {
            name: 'Cameron',
            email: 'cam@gmail.com'
        };

        let error = null;
        try {
            await XUpsertNow('email', cameronC, dgraphClient);
        } catch(e) {
            error = e;
        }

        const expectedError = new Error(`
                    More than one node matches "cam@gmail.com" for the "email" predicate. 
                    Aborting XUpsert. 
                    Delete the extra values before tyring XUpsert again.`);

        expect(error).toEqual(expectedError)
    })
    // it('should find or create an array of objects', async() => {
    //
    // })

});