import {xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {INodeFoundFunction, xUpsertCommitTxn} from './upsert';
import * as dgraph from 'dgraph-js'
import {IUpsertFnReturnValues} from './upsert';

interface IAvailability {
    fromUTC: string,
    toUTC: string
}

const cameronAvailabilitiesQuery = `{
    q(func: eq(name, "Cameron")) {
        availability(orderdesc: location) {
            uid
            fromUTC
            toUTC
            location
        }
    }
}`;

const userAvailabilityQueryFn = (name: string) => (node: IAvailability): IUpsertFnReturnValues => {
    const fromPresent: boolean = typeof node.fromUTC === 'string';
    const toPresent: boolean = typeof node.toUTC === 'string';

    if(!fromPresent || !toPresent) {
        throw new Error(`you must provide both a "fromUTC" and "toUTC" value on your input data ${JSON.stringify(node)}`)
    }

    // upsert query
    const dgraphQuery = `{
      q(func: eq(name, "${name}")) {
        uid
        availability @filter(eq(fromUTC, "${node.fromUTC}") and eq(toUTC, "${node.toUTC}"))
        {
          uid
        }
      }
    }`;

    // handles result of upsert query
    function nodeFoundFn(queryResult: dgraph.Response): INodeFoundFunction {
        const [user, ...others] = queryResult.getJson().q;

        // check we only have one user
        if(others.length > 0) {
            const error = new Error(`
                More than user was found, this function is only designed to upsert for a single user.
            `);

            throw error
        }

        const availability = user.availability || [];
        const [_existingUid, ...otherUids] = availability.map(r => r.uid);

        // check only a single availability matches
        if(otherUids.length > 0) {
            const error = new Error(`
                More than one availability was found, availabilities should be unique.
            `);
            throw error
        }

        const existingUid: string | null = _existingUid || null;

        function newNodeFn(node) {
            return {
                uid: user.uid,
                availability: node
            }
        }

        return {existingUid, newNodeFn}
    }
    return {dgraphQuery, nodeFoundFn}
};

describe('xUpsertCommitTxn with custom query', () => {
    it('finds and overwrites a node if one exists', async() => {
        const schema = `
            name: string @index(hash) @upsert .
            email: string @index(hash) .
            availability: uid @reverse .
            fromUTC: dateTime @index(hour) @upsert .
            toUTC: dateTime @index(hour) @upsert . 
            contactVia: string .
        `;

        const AVAILABILITY_A = {
            uid: "_:availabilityA",
            fromUTC: "2018-05-23T10:00:00Z",
            toUTC: "2018-05-23T12:00:00Z",
            location: 'At work'
        };

        const AVAILABILITY_B = {
            uid: "_:availabilityB",
            fromUTC: "2018-05-23T12:00:00Z",
            toUTC: "2018-05-23T13:00:00Z",
            location: 'At work'
        };

        const initialData = {
            name: 'Cameron',
            email: 'cam@gmail.com',
            availability: [
                AVAILABILITY_A,
                AVAILABILITY_B
            ]
        };

        const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: initialData});

        const map = result.getUidsMap();
        const availabilityBuid = map.get('availabilityB');

        // Update availability
        const AVAILABILITY_B_MODIFIED = {
            fromUTC: "2018-05-23T12:00:00Z",
            toUTC: "2018-05-23T13:00:00Z",
            location: 'At home'
        };

        await xUpsertCommitTxn(userAvailabilityQueryFn('Cameron'), AVAILABILITY_B_MODIFIED, dgraphClient);

        const cameronQuery = await dgraphClient.newTxn().query(cameronAvailabilitiesQuery);
        const [cameron] = cameronQuery.getJson().q;
        expect(cameron.availability.length).toEqual(2);

        const [, availabilityBresult] = cameron.availability;
        const expectedResult = {uid: availabilityBuid, ...AVAILABILITY_B_MODIFIED};
        expect(availabilityBresult).toEqual(expectedResult);
    });

    it('creates a new node if none exist', async() => {
        const schema = `
            name: string @index(hash) @upsert .
            email: string @index(hash) .
            availability: uid @reverse .
            fromUTC: dateTime @index(hour) .
            toUTC: dateTime @index(hour) . 
            contactVia: string .
        `;

        const AVAILABILITY_A = {
            fromUTC: "2018-05-23T10:00:00Z",
            toUTC: "2018-05-23T12:00:00Z",
            location: 'At work'
        };

        const initialData = {
            name: 'Cameron',
            email: 'cam@gmail.com',
            availability: []
        };

        const {dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema, data: initialData});

        await xUpsertCommitTxn(userAvailabilityQueryFn('Cameron'), AVAILABILITY_A, dgraphClient);

        const cameronQuery = await dgraphClient.newTxn().query(cameronAvailabilitiesQuery);
        const [cameron] = cameronQuery.getJson().q;
        expect(cameron.availability.length).toEqual(1);

        const [availabilty] = cameron.availability;
        expect(availabilty).toEqual({uid: jasmine.any(String), ...AVAILABILITY_A});
    })

});
