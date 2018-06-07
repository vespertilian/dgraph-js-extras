import * as dgraph from 'dgraph-js';
export interface IObjectMap {
    [key: string]: object;
}
export interface IUidMap {
    [key: string]: string;
}
export declare function xUpsertMapNow(queryFn: any, data: IObjectMap, dgraphClient: dgraph.DgraphClient, _dgraph?: typeof dgraph): Promise<IUidMap>;
