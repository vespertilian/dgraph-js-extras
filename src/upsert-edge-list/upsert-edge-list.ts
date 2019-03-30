/**
 * @module Upsert
 */
import * as dgraph from 'dgraph-js'
import { Txn } from 'dgraph-js';
import { IUpsertFnReturnValues, xDeleteJSON, xSetJSON } from '..';
import { isString } from '../util/is-string';
import { xValidateNodeExists } from '../validate-node-exists/validate-node-exists';
import { xUpsertObject } from '../upsert/upsert';

export interface IUpsertNode {
  uid: string
  predicate: string
}

/**
* Finds or creates new nodes on an edge replacing the old list with a new list.
* No nodes are deleted
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

export async function xUpsertEdgeListCommitTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, upsertNode: IUpsertNode, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph: any = dgraph) {
  const transaction = dgraphClient.newTxn();
  let result;
  let error: null | Error = null;

  try {
    result = await xUpsertEdgeList(upsertFn, upsertNode, nodes, transaction, _dgraph);
    transaction.commit();
  }
  catch(e) {
    error = e;
    throw e;
  }
  finally {
    try {
      await transaction.discard()
    } catch(e) {
      // the error e here will be the transaction.discard() error.
      // not the error we want - the one that was thrown in the try catch block
      throw(error);
    }
  }
  return result;
}

export async function xUpsertEdgeList(upsertFn: (input?: any) => IUpsertFnReturnValues, {uid, predicate}: IUpsertNode, nodes: object[], transaction: Txn, _dgraph: any = dgraph) {
  const upsertedNodes: string[] = [];

  if(!Array.isArray(nodes)) {
    throw new Error('You must pass nodes as an array of objects')
  }

  if(!isString(predicate)) {
    throw new Error('You must pass in a predicate string as part of the upsert node')
  }

  const nodeExists = await xValidateNodeExists(uid, transaction);
  if(!nodeExists) {
    // if the node does not exist you get an unhelpful error.
    // this one is better
    throw new Error(`You passed a uid for a node that does not exist, uid: ${uid}`)
  }

  // delete existing nodes off predicate
  const deleteAllPredicateLinks = {
    uid,
    [predicate]: null
  };

  await transaction.mutate(xDeleteJSON(deleteAllPredicateLinks));

  // find or create nodes
  for(let i=0; i < nodes.length; i++) {
    const currentNode = nodes[i];
    const result = await xUpsertObject(upsertFn, currentNode, transaction);
    upsertedNodes.push(result);
  }

  // add updated list of predicates
  const addPredicateLinks = {
    uid,
    [predicate]: upsertedNodes.map(uid => ({uid}))
  };

  await transaction.mutate(xSetJSON(addPredicateLinks, _dgraph));
  return upsertedNodes;
}
