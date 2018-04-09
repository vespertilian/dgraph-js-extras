import * as dgraph from 'dgraph-js';
export interface ICreateDgraphClientConfig {
    port?: number | null;
    host?: string | null;
    debug?: boolean;
    logAddress?: boolean;
}
export interface ICreateDGraph {
    dgraphClient: dgraph.DgraphClient;
    dgraphClientStub: dgraph.DgraphClientStub;
}
export declare function XCreateDgraphClient(config?: ICreateDgraphClientConfig, _dgraph?: typeof dgraph, infoLog?: (message?: any, ...optionalParams: any[]) => void): ICreateDGraph;
