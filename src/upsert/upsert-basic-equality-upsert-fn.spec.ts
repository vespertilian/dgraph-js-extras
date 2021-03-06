import {xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {getUids} from '../util/get-uids';
import {xUpsertCommitTxn} from './upsert';
import {basicEqualityUpsertFn} from './upsert-fns/basic-equality-upsert-fn';

const predicateNameQuery = `{
            q(func: has(name), orderasc: name) {
                uid
                name
                email
            }
        }`;

const predicateSkillQuery = `{
            q(func: has(skill), orderasc: level) {
                uid
                skill
                level
                x
                y
                z
            }
        }`;

describe('xUpsertCommitTxn with basic equality query function', () => {
    describe('Upserting a single value', () => {
        it('finds and overwrite a node if the node exists', async() => {

            const schema = `
            name: string @index(hash) .
            email: string @index(hash) @upsert .`;

            const initialData = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const {dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema, data: initialData});

            const initialUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const [initialCameron] = initialUidQuery.getJson().q;

            // update cameron
            const data = {
                name: 'Cameron Batt',
                email: 'cam@gmail.com'
            };

            const result = await xUpsertCommitTxn(basicEqualityUpsertFn('email'), data, dgraphClient);

            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const [finalCameron, ...others] = finalUidQuery.getJson().q;
            expect(others).toEqual([]); // should only be 1 result

            expect(finalCameron.uid).toEqual(initialCameron.uid);
            expect(finalCameron.name).toEqual(data.name);
            expect(result).toEqual(finalCameron.uid);
        });

        it('creates a new node if one does not exist', async() => {

            const schema = `
            name: string @index(hash) .
            email: string @index(hash) @upsert .`;

            const cameron = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: cameron});
            const [cameronUid] = getUids({numberOfIdsToGet: 1, result});

            // add helena
            const helena = {
                name: 'Helena ',
                email: 'h@gmail.com'
            };

            const helenaUid = await xUpsertCommitTxn(basicEqualityUpsertFn('email'), helena, dgraphClient);

            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;
            expect(users).toEqual([
                {...cameron, uid: cameronUid}, {...helena, uid: helenaUid} ]);
            // cameron and helena should both be present

        });

        it('throws an error if you try to upsert when two nodes exist for the searched predicate', async() => {
            const schema = `
            name: string @index(hash) .
            email: string @index(hash) @upsert .
        `;

            const cameronA = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const cameronB = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: [cameronA, cameronB]});
            const [cameronAUid, cameronBUid] = getUids({numberOfIdsToGet: 2, result});

            const cameronC = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            let error = null;
            try {
                await xUpsertCommitTxn(basicEqualityUpsertFn('email'), cameronC, dgraphClient);
            } catch(e) {
                error = e;
            }

            const expectedError = new Error(`
                    More than one node matches "cam@gmail.com" for the "email" predicate.
                    Aborting xUpsert. 
                    Delete the extra values before tyring xUpsert again.`);

            expect(error).toEqual(expectedError);
            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;
            // use toContain as order is random because they match the same search term
            expect(users).toContain( {...cameronA, uid: cameronAUid});
            expect(users).toContain({...cameronB, uid: cameronBUid});
        });

        it('throws an error when you try to upsert a deeply nested object that involves the creation of subnodes', async() => {
            const schema = `
                name: string @index(hash) .
                email: string @index(hash) @upsert .
                friends: uid .
            `;
            const {dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema});

            const cameronC = {
                name: 'Cameron',
                email: 'cam@gmail.com',
                friends: [
                    {
                        name: 'Stuart',
                        email: 'stu@gmail.com'
                    }
                ]
            };

            let error = null;
            try {
                await xUpsertCommitTxn(basicEqualityUpsertFn('email'), cameronC, dgraphClient);
            } catch(e) {
                error = e;
            }

            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;

            const message = `
                The find functions for xUpsert should only return a single node.
                That's how we know which node we need to update.
                
                Therefor xUpsert cannot support creating multiple new nodes.
                It seems that you have passed in an object that requires the creation of multiple nodes.
                
                Update your upsert to only create a single node at a time .
                xUpsert does accept an array of objects to upsert.
                
                Failed for object: ${JSON.stringify(cameronC)}
            `;

            expect(error.message).toEqual(message);
            expect(users.length).toBe(0); // user should have not been added
        });

        it('allows you to link existing nodes with an upsert', async() => {
            const schema = `
                name: string @index(hash) .
                email: string @index(hash) @upsert .
                friends: uid .
            `;

            const stuart = {
                name: 'Stuart',
                email: 'stu@gmail.com'
            };

            const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: stuart});
            const [stuartUid] = getUids({numberOfIdsToGet: 1, result});

            const cameronC = {
                name: 'Cameron',
                email: 'cam@gmail.com',
                friends: [{
                    uid: stuartUid
                }]
            };

            await xUpsertCommitTxn(basicEqualityUpsertFn('email'), cameronC, dgraphClient);

            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;

            expect(users.length).toBe(2); // user should have been added

            const friendQuery = await dgraphClient.newTxn().query(`{
                 q(func: eq(name, "Cameron")) {
                    name
                    friends {
                        name
                    }
                 }
            }`);

            const cameronAndFriend = friendQuery.getJson().q[0];
            expect(cameronAndFriend).toEqual({
                name: 'Cameron',
                friends: [
                    { name: 'Stuart' }
                ]
            })

        })

    });

    describe('upsert with multiple predicates', () => {

        it('upserts by matching more than one predicate with a filter', async() => {
            const schema = `
                skill: string @index(hash) @upsert .
                level: int @index(int) @upsert .
            `;

            const JSSenior = {
                skill: 'Javascript',
                level: 30,
                x: 'a',
                y: 'a',
                z: 'a'
            };

            const JSMid = {
                skill: 'Javascript',
                level: 20,
                x: 'c',
                y: 'b',
                z: 'b'
            };

            const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: [JSSenior, JSMid]});
            const [JSSeniorUid, JSMidUid] = getUids({numberOfIdsToGet: 2, result});

            const updateJSMid = {
                skill: 'Javascript',
                level: 20,
                x: 'd',
                y: 'c',
                z: 'e'
            };

            await xUpsertCommitTxn(basicEqualityUpsertFn(['skill', 'level']), updateJSMid, dgraphClient);

            const skillQuery = await dgraphClient.newTxn().query(predicateSkillQuery);
            const skills = skillQuery.getJson().q;

            expect(skills).toEqual([
                {...updateJSMid, uid: JSMidUid},
                {...JSSenior, uid: JSSeniorUid}
            ])
        });

        it('upserts by matching more than two predicates with a filter and an "and" clause', async() => {
            const schema = `
                skill: string @index(fulltext) @upsert .
                level: string @index(hash) @upsert .
                x: string @index(hash) @upsert .
            `;

            const JSSenior = {
                skill: 'Javascript',
                level: 'Senior',
                x: 'a',
                y: 'a',
                z: 'a'
            };

            const JSMid = {
                skill: 'Javascript',
                level: 'Midlevel',
                x: 'c',
                y: 'b',
                z: 'b'
            };

            const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: [JSSenior, JSMid]});
            const [JSSeniorUid, JSMidUid] = getUids({numberOfIdsToGet: 2, result});

            const update = {
                skill: 'Javascript',
                level: 'Midlevel',
                x: 'c',
                y: 'c',
                z: 'e'
            };

            await xUpsertCommitTxn(basicEqualityUpsertFn(['skill', 'level', 'x']), update, dgraphClient);

            const skillQuery = await dgraphClient.newTxn().query(predicateSkillQuery);
            const skills = skillQuery.getJson().q;

            expect(skills).toEqual([
                { ...update, uid: JSMidUid},
                { ...JSSenior, uid: JSSeniorUid}
            ])
        })

    });

    describe('upsert multiple values', () => {
        it('allows you to upsert multiple values', async() => {
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

            const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: [cameron, helena, barbara]});
            const [cameronUid, helenaUid, barabaraUid] = getUids({numberOfIdsToGet: 3, result});



            const initialUsersQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const initialUsers = initialUsersQuery.getJson().q;
            expect(initialUsers.length).toBe(3);

            // update cameron
            const cameronUpdate = {
                name: 'Cameron Batt',
                email: 'cam@gmail.com'
            };

            // add howard
            const howard = {
                name: 'Howard B',
                email: 'hb@gmail.com',
            };

            const [cameronUpdateUid, howardUid] = await xUpsertCommitTxn(basicEqualityUpsertFn('email'), [cameronUpdate, howard], dgraphClient);
            expect(cameronUpdateUid).toEqual(cameronUid);

            const queryUsers = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = queryUsers.getJson().q;

            expect(users).toEqual([
                {...barbara, uid: barabaraUid},
                {...cameronUpdate, uid: cameronUid},
                {...helena, uid: helenaUid},
                {...howard, uid: howardUid}
            ])
        })
    });

    it('upserts multiple values when matching more than one predicate with a filter', async() => {
        const schema = `
                skill: string @index(hash) @upsert .
                level: int @index(int) @upsert .
            `;

        const JSSenior = {
            skill: 'Javascript',
            level: 30,
            x: 'a',
            y: 'a',
            z: 'a'
        };

        const JSMid = {
            skill: 'Javascript',
            level: 20,
            x: 'c',
            y: 'b',
            z: 'b'
        };

        const JSJunior = {
            skill: 'Javascript',
            level: 10,
            x: 'c',
            y: 'b',
            z: 'b'
        };
        const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: [JSSenior, JSMid, JSJunior]});
        const [JSSeniorUid, JSMidUid, JSJuniorUid] = getUids({numberOfIdsToGet: 3, result});

        const updateMid = {
            skill: 'Javascript',
            level: 20,
            x: 'x',
            y: 'x',
            z: 'x'
        };

        const updateJunior = {
            skill: 'Javascript',
            level: 10,
            x: 'y',
            y: 'y',
            z: 'y'
        };

        const updates = [updateJunior, updateMid];

        await xUpsertCommitTxn(basicEqualityUpsertFn(['skill', 'level']), updates, dgraphClient);

        const skillQuery = await dgraphClient.newTxn().query(predicateSkillQuery);
        const skills = skillQuery.getJson().q;

        expect(skills.length).toEqual(3);
        expect(skills).toEqual([
            {...updateJunior, uid: JSJuniorUid},
            {...updateMid, uid: JSMidUid},
            {...JSSenior, uid: JSSeniorUid}
        ])
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

        const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: [cameron, helena1, helena2, barbara]});
        const [cameronUid, helena1Uid, helena2Uid, barbaraUid] = getUids({numberOfIdsToGet: 4, result});

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

        let errors: Error[] | null = null;
        try {
            await xUpsertCommitTxn(basicEqualityUpsertFn('email'), [cameronUpdate, helenaUpdate, cameronUpdate, stuart], dgraphClient);
        } catch (e) {
            errors = e
        }

        const queryUsers = await dgraphClient.newTxn().query(predicateNameQuery);
        const users = queryUsers.getJson().q;
        expect(users).toEqual([
            {...barbara, uid: barbaraUid},
            {...cameron, uid: cameronUid},
            {...helena1, uid: helena1Uid},
            {...helena2, uid: helena2Uid},
        ]);

        const error = new Error(`
                    More than one node matches "h@gmail.com" for the "email" predicate.
                    Aborting xUpsert. 
                    Delete the extra values before tyring xUpsert again.`);
        expect(errors).toEqual([error])
    })
});
