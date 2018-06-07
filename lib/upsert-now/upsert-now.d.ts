import * as dgraph from 'dgraph-js';
export interface INodeFoundFunction {
    existingUid: string | null;
    newNodeFn?: (node: any) => object;
}
export interface IUpsertFnReturnValues {
    dgraphQuery: string;
    nodeFoundFn: (queryResult: dgraph.Response) => INodeFoundFunction;
}
export declare function xUpsertNow(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string[]>;
export declare function xUpsertNow(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string>;
