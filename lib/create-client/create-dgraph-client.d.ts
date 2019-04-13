/**
 * @module TestHelpers
 */
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
export declare function xCreateDgraphClient(config?: ICreateDgraphClientConfig, _dgraph?: any, infoLog?: (message?: any, ...optionalParams: any[]) => void): ICreateDGraph;
