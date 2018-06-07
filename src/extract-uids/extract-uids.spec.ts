import {xSetupForTestNow} from '../test-helpers/setup';
import {xSetJSONNow} from '../set-json-now/set-json-now';
import {isPromise, xExtractFirstUid, xExtractUids} from './extract-uids';
import * as messages from "dgraph-js/generated/api_pb";

const users = [
    { username: 'user1' },
    { username: 'user2' },
    { username: 'user3' },
    { username: 'user4' },
    { username: 'user5' },
];

describe('xExtractUids', () => {
    it('should accept a promise and return the uids as an array', async() => {
        const {dgraphClient} = await xSetupForTestNow();
        const ids = await xExtractUids(xSetJSONNow(users, dgraphClient));
        expect(ids.length).toEqual(5);
    });

    describe('Errors', () => {
        const junkObject = {junk: 'junk'};
        const stringifiedJunkObject = JSON.stringify(junkObject);
        it('should throw an informative error when a promise is passed in', async() => {
            const junkPromise = Promise.resolve(junkObject);

            let error = null;
            try {
                await xExtractUids(junkPromise as any);
            } catch(e) {
                error = e
            }

            expect(error.message).toContain('xExtractUids could not extract uids from');
            expect(error.message).toContain('Original Error');
            expect(error.message).toContain(stringifiedJunkObject);
        });

        it('should throw an informative error when any object is passed in', () => {
            let error = null;
            try {
                xExtractUids(junkObject as any);
            } catch(e) {
                error = e
            }

            expect(error.message).toContain('xExtractUids could not extract uids from');
            expect(error.message).toContain('Original Error');
            expect(error.message).toContain(stringifiedJunkObject);
        });
    });

    describe('with existing result', async() => {

        let result: messages.Assigned;

        beforeAll(async(done) => {
            const {dgraphClient} = await xSetupForTestNow();
            result = await xSetJSONNow(users, dgraphClient);
            done()
        });

        it('should return results that are strings',() => {
            const ids = xExtractUids(result, 3);
            expect(typeof ids[0]).toBe('string')
        });

        it('should accept a result and return the uids as an array',() => {
            const ids = xExtractUids(result, 3);
            expect(ids.length).toBe(3);
        });

        it('should return all uids when no parameters are passed in',() => {
            const ids = xExtractUids(result);
            expect(ids.length).toBe(5);
        });
    });
});

describe('xExtractFirstUid', () => {
    it('should extract only the first uid from the SetJSON result from a promise', async() => {
        const {dgraphClient} = await xSetupForTestNow();
        const id = await xExtractFirstUid(xSetJSONNow(users, dgraphClient));
        expect(typeof id).toEqual('string')
    });

    it('should extract only the first uid from the SetJSON result from an existing result', async() => {
        const {dgraphClient} = await xSetupForTestNow();
        const result = await xSetJSONNow(users, dgraphClient);
        const id = xExtractFirstUid(result);
        expect(typeof id).toEqual('string')
    })
});

describe('.isPromise util', () => {
    // util from stack overflow suggestion
    // https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199

    it('should return true when passed a promise', () => {
        const testPromise = Promise.resolve('promise');
        expect(isPromise(testPromise)).toBe(true)
    });

    it('should return true for an async function (as they are promises)', () => {
        async function testAsyncFunc(): Promise<number> {
            return 1
        }
        expect(isPromise(testAsyncFunc())).toBe(true)
    });

    it('should return false when a string', () => {
        expect(isPromise('junk')).toBe(false)
    });

    it('should return false when an object', () => {
        expect(isPromise({junk: 'junk'})).toBe(false)
    });
});


