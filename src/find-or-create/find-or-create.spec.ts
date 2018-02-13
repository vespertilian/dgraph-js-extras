import {findOrCreate} from './find-or-create';

describe('find or create', () => {
    it('should return hello world', () => {
        expect(findOrCreate()).toEqual('Hello World')
    })
});