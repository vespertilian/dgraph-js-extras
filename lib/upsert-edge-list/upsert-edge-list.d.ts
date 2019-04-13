/**
 * @module Upsert
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
import { IUpsertFnReturnValues } from '..';
export interface IUpsertNode {
    uid: string;
    predicate: string;
}
/**
* #### Replaces an existing list of nodes.
* - Finds or creates new nodes on an edge.
* - Removes any nodes not listed from the edge.
* - No nodes are deleted, the link is just removed.
*
* Example
* ```ts
* // upsert on streetName and postCode
* const addressUpsert = basicEqualityUpsertFn(['streetName', 'postCode']);
*
* const newAddresses = [
*   { streetName: 'Clarence', postCode: 2444 },
*   { streetName: 'New Street', postCode: 2444 },
*   { streetName: 'William', postCode: 2444 },
* ];
*
* const upsertNode: IUpsertNode = {
*   uid: 0x2345, // the node you want to update a list on
*   predicate: 'addresses' // the list predicate
* };
*
* await xUpsertEdgeListCommitTxn(addressUpsert, upsertNode, newAddresses, dgraphClient);
* ```
*/
export declare function xUpsertEdgeListCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, upsertNode: IUpsertNode, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph?: any): Promise<any>;
/**
 * The same as {@link xUpsertEdgeListCommitTxn} but you have to pass in your own transaction.
 */
export declare function xUpsertEdgeList(upsertFn: (input?: any) => IUpsertFnReturnValues, { uid, predicate }: IUpsertNode, nodes: object[], transaction: Txn, _dgraph?: any): Promise<string[]>;
