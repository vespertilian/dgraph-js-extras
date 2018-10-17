import {xCreateDgraphClient} from './create-dgraph-client';
import * as dgraph from 'dgraph-js'

describe('xCreateNewDgraphClient', () => {
    it('by default creates a client with port 9080 on localhost', () => {
        const clientStubSpy = spyOn(dgraph, 'DgraphClientStub');

        const {dgraphClient, dgraphClientStub} = xCreateDgraphClient({}, dgraph);

        expect(clientStubSpy).toHaveBeenCalledWith('localhost:9080', jasmine.anything());
        expect(dgraphClient).toBeDefined();
        expect(dgraphClientStub).toBeDefined();
    });

    it('creates a client with the port and host when called as part of the function', () => {
        const clientStubSpy = spyOn(dgraph, 'DgraphClientStub');

        // the passed in config should take precedent over all other
        // set process env to test this
        process.env.DGRAPH_PORT = '1111';
        const {dgraphClient, dgraphClientStub} = xCreateDgraphClient({port: 9999, host: 'http://foo'}, dgraph);

        expect(clientStubSpy).toHaveBeenCalledWith('http://foo:9999', jasmine.anything());
        expect(dgraphClient).toBeDefined();
        expect(dgraphClientStub).toBeDefined();

        // remove process.env.DGRAPH_PORT
        delete process.env.DGRAPH_PORT;
    });

    it('uses the process.env variables if no config variables were passed in', () => {
        const clientStubSpy = spyOn(dgraph, 'DgraphClientStub');

        // the passed in config should take precedent over all other
        // set process env to test this
        process.env.DGRAPH_PORT = '1111';
        process.env.DGRAPH_HOST = 'http://bar.com';
        const {dgraphClient, dgraphClientStub} = xCreateDgraphClient({}, dgraph);

        expect(clientStubSpy).toHaveBeenCalledWith('http://bar.com:1111', jasmine.anything());
        expect(dgraphClient).toBeDefined();
        expect(dgraphClientStub).toBeDefined();

        // remove process.env.DGRAPH_PORT
        delete process.env.DGRAPH_PORT;
        delete process.env.DGRAPH_HOST;
    });

    it('logs the address and port it is connecting to if logAddress is set to true', () => {
        const logSpy = jasmine.createSpy('log');
        xCreateDgraphClient({logAddress: true}, dgraph, logSpy);

        expect(logSpy).toHaveBeenCalledWith('configuring Dgraph host address: localhost:9080');
    });

    it('logs the address and port it is connecting to if debug is set to true', () => {
        const logSpy = jasmine.createSpy('log');
        xCreateDgraphClient({debug: true}, dgraph, logSpy);

        expect(logSpy).toHaveBeenCalledWith('configuring Dgraph host address: localhost:9080');
    });

    it('does not log the address and port it is connecting to by default', () => {
        const logSpy = jasmine.createSpy('log');
        xCreateDgraphClient({}, dgraph, logSpy);

        expect(logSpy).not.toHaveBeenCalled();
    });

    it('sets debug on the dgraph client if it was passed in as an option', () => {
        const logSpy = jasmine.createSpy('log');
        const dgraphClientSpy = jasmine.createSpyObj('dgraphClient', ['setDebugMode']);
        spyOn(dgraph, 'DgraphClient')
            .and.returnValue(dgraphClientSpy);

        xCreateDgraphClient({debug: true}, dgraph, logSpy);
        expect(dgraphClientSpy.setDebugMode).toHaveBeenCalledWith(true)
    })

});
