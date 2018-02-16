import {setupWith} from '../../test-helpers/setup';
import {XUpsertNow} from './upsert-now';

const predicateNameQuery = `{
            q(func: has(name), orderasc: name) {
                name
                email
            }
        }`;


describe('XUpsertNow', () => {
    describe('Upsert a single value', () => {
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
        The search predicate/s must be a searchable value on the object you are creating.
        
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

            expect(error).toEqual(expectedError);
            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;
            expect(users).toEqual([cameronA, cameronB]);
        })
    });

    describe('upsert multiple values', () => {
        it('should allow you to upsert multiple values', async() => {
            // setup
            const schema = `
                name: string @index(fulltext) .
                email: string @index(exact) .
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

            const {dgraphClient} = await setupWith({schema, data: [cameron, helena, barbara]});

            const initialUsersQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const initialUsers = initialUsersQuery.getJson().q;
            expect(initialUsers.length).toBe(3);

            // update cameron
            const cameronUpdate = {
                name: 'Cameron Batt',
                email: 'cam@gmail.com'
            };

            const howard = {
                name: 'Howard B',
                email: 'hb@gmail.com',
            };

            await XUpsertNow('email', [cameronUpdate, howard], dgraphClient);

            const queryUsers = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = queryUsers.getJson().q;

            expect(users).toEqual([barbara, cameronUpdate, helena, howard])
        })
    });

    it('should throw an error highlighting any update failures', async() => {
        // setup
        const schema = `
                name: string @index(fulltext) .
                email: string @index(exact) .
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

        const {dgraphClient} = await setupWith({schema, data: [cameron, helena1, helena2, barbara]});

        const cameronUpdate = {
            name: 'Cameron B',
            email: 'cam@gmail.com',
        };

        const helenaUpdate = {
            name: 'Real Helena',
            email: 'h@gmail.com'
        };

        const stuart = {
            name: 'Stuart',
            email: 's@gmail.com'
        };

        let errors: Error | null = null;
        try {
            await XUpsertNow('email', [cameronUpdate, helenaUpdate, stuart], dgraphClient);
        } catch (e) {
            errors = e;
        }

        const queryUsers = await dgraphClient.newTxn().query(predicateNameQuery);
        const users = queryUsers.getJson().q;

        expect(users).toEqual([barbara, cameronUpdate, helena1, helena2, stuart]);
        expect(errors.message).toContain('1 node/s failed');
        expect(errors.message).toContain('More than one node matches "h@gmail.com" for the "email" predicate. ')
        expect(errors.message).toContain('All other nodes were upserted')
    })
});