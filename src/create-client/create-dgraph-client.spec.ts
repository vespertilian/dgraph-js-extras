import {createDgraphClient} from './create-dgraph-client';
import * as dgraph from 'dgraph-js'

describe('create a new dgraph client', () => {
    it('should by default create a client with port 9080 on localhost', () => {
        const clientStubSpy = spyOn(dgraph, 'DgraphClientStub');

        const {dgraphClient, dgraphClientStub} = createDgraphClient({}, dgraph);

        expect(clientStubSpy).toHaveBeenCalledWith('localhost:9080', jasmine.anything());
        expect(dgraphClient).toBeDefined();
        expect(dgraphClientStub).toBeDefined();
    });

    it('should create a client with the port an host when called as part of the function', () => {
        const clientStubSpy = spyOn(dgraph, 'DgraphClientStub');

        // the passed in config should take precedent over all other
        // set process env to test this
        process.env.DGRAPH_PORT = '1111';
        const {dgraphClient, dgraphClientStub} = createDgraphClient({port: 9999, host: 'http://foo'}, dgraph);

        expect(clientStubSpy).toHaveBeenCalledWith('http://foo:9999', jasmine.anything());
        expect(dgraphClient).toBeDefined();
        expect(dgraphClientStub).toBeDefined();

        // remove process.env.DGRAPH_PORT
        delete process.env.DGRAPH_PORT;
    });

    it('should use the process.env variables if no config variables were passed in', () => {
        const clientStubSpy = spyOn(dgraph, 'DgraphClientStub');

        // the passed in config should take precedent over all other
        // set process env to test this
        process.env.DGRAPH_PORT = '1111';
        process.env.DGRAPH_HOST = 'http://bar.com';
        const {dgraphClient, dgraphClientStub} = createDgraphClient({}, dgraph);

        expect(clientStubSpy).toHaveBeenCalledWith('http://bar.com:1111', jasmine.anything());
        expect(dgraphClient).toBeDefined();
        expect(dgraphClientStub).toBeDefined();

        // remove process.env.DGRAPH_PORT
        delete process.env.DGRAPH_PORT;
        delete process.env.DGRAPH_HOST;
    });

    it('should log messages when debug true is set', () => {

        const logSpy = jasmine.createSpy('log');
        const consoleLogSpy = spyOn(console, 'log');
        const {dgraphClient} = createDgraphClient({debug: true}, dgraph, logSpy);

        // check dgraph client debug was set;
        dgraphClient.debug('foo');

        expect(logSpy).toHaveBeenCalledWith('configuring dgraph host address: localhost:9080');
        expect(consoleLogSpy).toHaveBeenCalledWith('foo');

    })

});
