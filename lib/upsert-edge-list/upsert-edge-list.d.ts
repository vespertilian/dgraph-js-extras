import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
import { IUpsertFnReturnValues } from '..';
export interface IUpsertNode {
    uid: string;
    predicate: string;
}
export declare function xUpsertEdgeListTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, upsertNode: IUpsertNode, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: typeof dgraph): Promise<string[]>;
export declare function xUpsertEdgeList(upsertFn: (input?: any) => IUpsertFnReturnValues, {uid, predicate}: IUpsertNode, nodes: object[], transaction: Txn, _dgraph?: typeof dgraph): Promise<string[]>;
