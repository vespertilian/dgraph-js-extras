import {XSetupWithSchemaDataNow} from '../test-helpers/setup';
import {XUpsertNow} from './upsert-now';
import * as dgraph from 'dgraph-js'
import {queryFnReturnValues} from './upsert-now';

interface IAvailability {
    fromUTC: string,
    toUTC: string
}

const cameronAvailabilitiesQuery = `{
    q(func: eq(name, "Cameron")) {
        availability {
            uid
            fromUTC
            toUTC
            location
        }
    }
}`;

const userAvailabilityQueryFn = (name: string) => (node: IAvailability): queryFnReturnValues => {
    const fromPresent: boolean = typeof node.fromUTC === 'string';
    const toPresent: boolean = typeof node.toUTC === 'string';

    if(!fromPresent || !toPresent) {
        throw new Error(`you must provide both a "fromUTC" and "toUTC" value on your input data ${JSON.stringify(node)}`)
    }

    const dgraphQuery = `{
      q(func: eq(name, "${name}")) {
        availability @filter(eq(fromUTC, "${node.fromUTC}") and eq(toUTC, "${node.toUTC}"))
        {
          uid
        }
      }
    }`;

    function nodeFoundFn(queryResult: dgraph.Response): string | null {
        const [firstUser, ...others] = queryResult.getJson().q;

        if(others.length > 0) {
            const error = new Error(`
                More than user was found, this function is only designed to upsert for a single user.
            `);

            throw error
        }

        const [firstUid, ...otherUids] = firstUser.availability.map(r => r.uid);

        if(otherUids.length > 0) {
            const error = new Error(`
                More than one availability was found, availabilities should be unique.
            `);
            throw error
        }
        return firstUid
    }

    return {dgraphQuery, nodeFoundFn}
};

describe('XUpsertNow with custom query', () => {
    it('should find an overwrite a node if one exists', async() => {
        const schema = `
            name: string @index(hash) .
            email: string @index(hash) .
            availability: uid @reverse .
            fromUTC: dateTime @index(hour) .
            toUTC: dateTime @index(hour) . 
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

        const {dgraphClient, result} = await XSetupWithSchemaDataNow({schema, data: initialData});

        const map = result.getUidsMap();
        const availabilityBuid = map.get('availabilityB'); //?

        // Update availability
        const AVAILABILITY_B_MODIFIED = {
            fromUTC: "2018-05-23T12:00:00Z",
            toUTC: "2018-05-23T13:00:00Z",
            location: 'At home'
        };

        await XUpsertNow(userAvailabilityQueryFn('Cameron'), AVAILABILITY_B_MODIFIED, dgraphClient);

        const cameronQuery = await dgraphClient.newTxn().query(cameronAvailabilitiesQuery);
        const [cameron] = cameronQuery.getJson().q;
        expect(cameron.availability.length).toEqual(2);

        const [, availabilityBresult] = cameron.availability;
        const expectedResult = {uid: availabilityBuid, ...AVAILABILITY_B_MODIFIED};
        expect(availabilityBresult).toEqual(expectedResult);
    })
});
