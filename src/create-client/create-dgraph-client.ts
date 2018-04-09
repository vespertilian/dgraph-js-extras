import * as grpc from 'grpc';
import * as dgraph from 'dgraph-js'

export interface ICreateDgraphClientConfig {
   port?: number | null
   host?: string | null
   debug?: boolean
   logPort?: boolean
}
export interface ICreateDGraph {
    dgraphClient: dgraph.DgraphClient,
    dgraphClientStub: dgraph.DgraphClientStub
}

export function XCreateDgraphClient(config?: ICreateDgraphClientConfig, _dgraph=dgraph, infoLog=console.info): ICreateDGraph {
    const defaults = {
        port: null,
        host: null,
        debug: false,
        logPort: false
    };

    const {port, host, debug, logPort} = Object.assign(defaults, config);

    // use params passed in, followed env values, followed by a static default
    const _port = port || process.env.DGRAPH_PORT || 9080;
    const _host = host || process.env.DGRAPH_HOST || 'localhost';
    const address = `${_host}:${_port}`;

    if(debug || logPort) {
        infoLog(`configuring Dgraph host address: ${address}`);
    }

    const grpcCredentials = grpc.credentials.createInsecure();

    const dgraphClientStub = new _dgraph.DgraphClientStub(
        address,
        grpcCredentials
    );

    const dgraphClient = new _dgraph.DgraphClient(dgraphClientStub);

    dgraphClient.setDebugMode(debug);
    return { dgraphClient, dgraphClientStub }
}