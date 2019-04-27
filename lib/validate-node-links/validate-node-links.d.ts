/**
 * @module Validate
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface IValidateNodeLinks {
    node: string;
    edgeName: string;
    linkedNodesUids: string[];
}
/**
* Same as {@link xValidateNodeLinks} but it creates it's own transaction
*/
export declare function xValidateNodeLinksTxn(params: IValidateNodeLinks, dgraphClient: dgraph.DgraphClient): Promise<boolean>;
/**
* Validates nodeA is linked to the specified edge name on nodeB
*
* ```ts
* const users = [
* {
*   uid: '_:user1',
*   username: 'user1',
*   addresses: [{
*     uid: '_:user1address1',
*     postcode: 2444
*   }]
* },
* {
*   uid: '_:user2',
*   username: 'user2',
*   addresses: [
*     {
*       uid: '_:user2address1',
*       postcode: 2000
*     },
*     {
*       uid: '_:user2address2',
*       postcode: 2000
*     }
*   ]
* }];
* const params = {
*  node: user1uid,
*  edgename: 'addresses',
*  linkednodesuids: [user1addressuid]
* };
* // this will return true as user1 does have address 1
* const result = await xvalidatenodelinkstxn(params, dgraphclient);
* ```
*
*/
export declare function xValidateNodeLinks(params: IValidateNodeLinks, txn: Txn): Promise<boolean>;
