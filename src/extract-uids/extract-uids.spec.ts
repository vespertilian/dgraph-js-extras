import {XSetupForTestNow} from '../test-helpers/setup';
import {XSetJSONNow} from '../set-json-now/set-json-now';
import {isPromise, XExtractFirstUid, XExtractUids} from './extract-uids';
import * as messages from "dgraph-js/generated/api_pb";

const users = [
    { username: 'user1' },
    { username: 'user2' },
    { username: 'user3' },
    { username: 'user4' },
    { username: 'user5' },
];

describe('XExtractUids', () => {

    it('should accept a promise and return the uids as an array', async() => {
        const {dgraphClient} = await XSetupForTestNow();
        const ids = await XExtractUids(XSetJSONNow(users, dgraphClient));
        expect(ids.length).toEqual(5);
    });

    it('should throw an informative error when a promise is passed in', async() => {
        const junkPromise = Promise.resolve({junk: 'junk'});

        let error = null;
        try {
            await XExtractUids(junkPromise as any);
        } catch(e) {
            error = e
        }

        expect(error.message).toContain('XExtractUids could not extract uids from');
        expect(error.message).toContain('Original Error');
    });

    it('should throw an informative error when any object is passed in', () => {
        let error = null;
        try {
            XExtractUids({junk: 'junk'} as any);
        } catch(e) {
            error = e
        }

        expect(error.message).toContain('XExtractUids could not extract uids from');
        expect(error.message).toContain('Original Error');
    });

    describe('with existing result', async() => {

        let result: messages.Assigned;

        beforeAll(async() => {
            const {dgraphClient} = await XSetupForTestNow();
            result = await XSetJSONNow(users, dgraphClient);
        });

        it('should return results that are strings',() => {
            const ids = XExtractUids(result, 3);
            expect(typeof ids[0]).toBe('string')
        });

        it('should accept a result and return the uids as an array',() => {
            const ids = XExtractUids(result, 3);
            expect(ids.length).toBe(3);
        });

        it('should return all uids when no parameters are passed in',() => {
            const ids = XExtractUids(result);
            expect(ids.length).toBe(5);
        });
    });
});

describe('XExtractFirstUid', () => {
    it('should extract only the first uid from the SetJSON result from a promise', async() => {
        const {dgraphClient} = await XSetupForTestNow();
        const id = await XExtractFirstUid(XSetJSONNow(users, dgraphClient));
        expect(typeof id).toEqual('string')
    });

    it('should extract only the first uid from the SetJSON result from an existing result', async() => {
        const {dgraphClient} = await XSetupForTestNow();
        const result = await XSetJSONNow(users, dgraphClient);
        const id = XExtractFirstUid(result);
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


