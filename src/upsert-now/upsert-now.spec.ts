import {XSetupForTestNow, XSetupWithSchemaDataNow} from '../test-helpers/setup';
import {getUids} from '../test-helpers/get-uids';
import {XUpsertNow} from './upsert-now';

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

describe('XUpsertNow', () => {
    describe('Upsert a single value', () => {
        it('should throw an error if the key predicate is not present on the object being used for the upsert', async() => {

            const {dgraphClient} = await XSetupForTestNow();
            const data = {
                name: 'cameron'
            };

            let error = null;
            try {
                await XUpsertNow('email', data, dgraphClient)
            } catch (e) {
                error = e
            }

            const expectedError = new Error(`
        The search predicate/s must be a value on the object you are trying to persist.
        
        "email" does not exist on:
        {"name":"cameron"}`);

            expect(error).toEqual(expectedError);
        });


        it('should find and overwrite a node if the node exists', async() => {

            // XSetupForTestNow
            const schema = `
            name: string @index(hash) .
            email: string @index(hash) .`;

            const initialData = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const {dgraphClient} = await XSetupWithSchemaDataNow({schema, data: initialData});

            const initialUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const [initialCameron] = initialUidQuery.getJson().q;

            // update cameron
            const data = {
                name: 'Cameron Batt',
                email: 'cam@gmail.com'
            };

            const result = await XUpsertNow('email', data, dgraphClient);

            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const [finalCameron, ...others] = finalUidQuery.getJson().q;
            expect(others).toEqual([]); // should only be 1 result

            expect(finalCameron.uid).toEqual(initialCameron.uid);
            expect(finalCameron.name).toEqual(data.name);
            expect(result).toEqual(finalCameron.uid);
        });

        it('should create a new node if one does not exist', async() => {

            // XSetupForTestNow
            const schema = `
            name: string @index(hash) .
            email: string @index(hash) .`;

            const cameron = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: cameron});
            const [cameronUid] = getUids({numberOfIdsToGet: 1, result});

            // add helena
            const helena = {
                name: 'Helena ',
                email: 'h@gmail.com'
            };

            const helenaUid = await XUpsertNow('email', helena, dgraphClient);

            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;
            expect(users).toEqual([
                {...cameron, uid: cameronUid}, {...helena, uid: helenaUid} ]);
                // cameron and helena should both be present

        });

        it('should throw an error if you try to upsert when two nodes exist for the searched predicate', async() => {
            // XSetupForTestNow
            const schema = `
            name: string @index(hash) .
            email: string @index(hash) .
        `;

            const cameronA = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const cameronB = {
                name: 'Cameron',
                email: 'cam@gmail.com'
            };

            const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: [cameronA, cameronB]});
            const [cameronAUid, cameronBUid] = getUids({numberOfIdsToGet: 2, result});

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
                    Aborting XUpsertNow. 
                    Delete the extra values before tyring XUpsert again.`);

            expect(error).toEqual(expectedError);
            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;
            // use toContain as order is random because they match the same search term
            expect(users).toContain( {...cameronA, uid: cameronAUid});
            expect(users).toContain({...cameronB, uid: cameronBUid});
        });

        it('should throw an error when you try to upsert a deeply nested object that involves the creation of subnodes', async() => {
            // XSetupForTestNow
            const schema = `
                name: string @index(hash) .
                email: string @index(hash) .
                friends: uid .
            `;
            const {dgraphClient} = await XSetupWithSchemaDataNow({schema});

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
                await XUpsertNow('email', cameronC, dgraphClient);
            } catch(e) {
                error = e;
            }


            const finalUidQuery = await dgraphClient.newTxn().query(predicateNameQuery);
            const users = finalUidQuery.getJson().q;

            const message: string = `
                XUpsertNow does not support finding and creating nested objects.
                Failed for object: ${JSON.stringify(cameronC)}
                You should write your own custom transaction for this.
                You can upsert existing references if you have the UID.
            `;

            expect(users.length).toBe(0); // user should have not been added
            expect(error.message).toEqual(message)
        });

        it('should allow you to link existing nodes with an upsert', async() => {
            // XSetupForTestNow
            const schema = `
                name: string @index(hash) .
                email: string @index(hash) .
                friends: uid .
            `;

            const stuart = {
                name: 'Stuart',
                email: 'stu@gmail.com'
            };

            const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: stuart});
            const [stuartUid] = getUids({numberOfIdsToGet: 1, result});

            const cameronC = {
                name: 'Cameron',
                email: 'cam@gmail.com',
                friends: [{
                    uid: stuartUid
                }]
            };

            await XUpsertNow('email', cameronC, dgraphClient);

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

        it('should upsert by matching more than one predicate with a filter', async() => {
            const schema = `
                skill: string @index(hash) .
                level: int @index(int) .
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

            const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: [JSSenior, JSMid]});
            const [JSSeniorUid, JSMidUid] = getUids({numberOfIdsToGet: 2, result});

            const updateJSMid = {
                skill: 'Javascript',
                level: 20,
                x: 'd',
                y: 'c',
                z: 'e'
            };

            await XUpsertNow(['skill', 'level'], updateJSMid, dgraphClient);

            const skillQuery = await dgraphClient.newTxn().query(predicateSkillQuery);
            const skills = skillQuery.getJson().q;

            expect(skills).toEqual([
                {...updateJSMid, uid: JSMidUid},
                {...JSSenior, uid: JSSeniorUid}
            ])
        });

        it('should upsert by matching more than two predicates with a filter and an "and" clause', async() => {
            const schema = `
                skill: string @index(fulltext) .
                level: string @index(hash) .
                x: string @index(hash) .
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

            const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: [JSSenior, JSMid]});
            const [JSSeniorUid, JSMidUid] = getUids({numberOfIdsToGet: 2, result});

            const update = {
                skill: 'Javascript',
                level: 'Midlevel',
                x: 'c',
                y: 'c',
                z: 'e'
            };

            await XUpsertNow(['skill', 'level', 'x'], update, dgraphClient);

            const skillQuery = await dgraphClient.newTxn().query(predicateSkillQuery);
            const skills = skillQuery.getJson().q;

            expect(skills).toEqual([
                { ...update, uid: JSMidUid},
                { ...JSSenior, uid: JSSeniorUid}
            ])
        })

    });

    describe('upsert multiple values', () => {
        it('should allow you to upsert multiple values', async() => {
            // XSetupForTestNow
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

            const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: [cameron, helena, barbara]});
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

            const [cameronUpdateUid, howardUid] = await XUpsertNow('email', [cameronUpdate, howard], dgraphClient);
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

    it('should upsert multiple values when matching more than one predicate with a filter', async() => {
        const schema = `
                skill: string @index(hash) .
                level: int @index(int) .
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
        const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: [JSSenior, JSMid, JSJunior]});
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

        await XUpsertNow(['skill', 'level'], updates, dgraphClient);

        const skillQuery = await dgraphClient.newTxn().query(predicateSkillQuery);
        const skills = skillQuery.getJson().q;

        expect(skills.length).toEqual(3);
        expect(skills).toEqual([
            {...updateJunior, uid: JSJuniorUid},
            {...updateMid, uid: JSMidUid},
            {...JSSenior, uid: JSSeniorUid}
        ])
    });

    it('should throw an error highlighting why an update failed', async() => {
        // XSetupForTestNow
        const schema = `
                name: string @index(fulltext) .
                email: string @index(hash) .
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

        const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: [cameron, helena1, helena2, barbara]});
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
            await XUpsertNow('email', [cameronUpdate, helenaUpdate, cameronUpdate, stuart], dgraphClient);
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
                    Aborting XUpsertNow. 
                    Delete the extra values before tyring XUpsert again.`);
        expect(errors).toEqual([error])

    })
});