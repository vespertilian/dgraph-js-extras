import {XSetupForTestNow} from './setup';

describe('setup', () => {
    describe('XSetupForTestNow', () => {
        it('should call create client with test defaults and drop the db', async() => {
            const createDgraphClientSpy = jasmine.createSpy('createDgraphClientSpy');

            const dgraphClientAndStubMock: any = {
                dgraphClient: 'dgraphClientMock',
                dgraphClientStub: 'dgraphClientStubMock'
            };
            createDgraphClientSpy.and.returnValue(dgraphClientAndStubMock);

            const dropAllSpy = jasmine.createSpy('dropAll');

            const result = await XSetupForTestNow({}, createDgraphClientSpy, dropAllSpy);

            expect(createDgraphClientSpy).toHaveBeenCalledWith({
                port: 9081,
                host: null,
                debug: false
            });

            expect(dropAllSpy).toHaveBeenCalledWith('dgraphClientMock');
            expect(result).toEqual(dgraphClientAndStubMock)
        })
    })
});
