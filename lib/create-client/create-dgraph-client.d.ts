/**
 * @module CreateClient
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
/**
 * xCreateDgraphClient has some smart defaults and takes optional config, returns a dgraphClient and dgraphClientStub.
 *
 * ```ts
 * // No config required
 * const { dgraphClient, dgraphClientStub } = xCreateDgraphClient()
 *
 * // The host and port are set to either the settings you passed in config, or the process or 9080, localhost
 * const _port = port || process.env.DGRAPH_PORT || 9080;
 * const _host = host || process.env.DGRAPH_HOST || 'localhost';
 * ```
 */
export declare function xCreateDgraphClient(config?: ICreateDgraphClientConfig, _dgraph?: any, infoLog?: (message?: any, ...optionalParams: any[]) => void): ICreateDGraph;
