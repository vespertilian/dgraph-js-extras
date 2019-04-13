/**
 * @module Upsert
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface INodeFoundFunction {
    existingUid: string | null;
    newNodeFn?: (node: any) => object;
}
export interface IUpsertFnReturnValues {
    dgraphQuery: string;
    nodeFoundFn: (queryResult: dgraph.Response) => INodeFoundFunction;
}
export declare function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string[]>;
export declare function xUpsertCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, data: object, dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<string>;
export declare function xUpsertObject(upsertFn: (input?: any) => IUpsertFnReturnValues, node: object, transaction: Txn): Promise<string | null>;
