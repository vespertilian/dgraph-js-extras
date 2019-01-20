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

export async function xUpsertEdgeListTxn(upsertFn: (input?: any) => IUpsertFnReturnValues, upsertNode: IUpsertNode, nodes: object[], dgraphClient: dgraph.DgraphClient, _dgraph=dgraph) {
  const transaction = dgraphClient.newTxn();
  return xUpsertEdgeList(upsertFn, upsertNode, nodes, transaction, _dgraph)
}

export async function xUpsertEdgeList(upsertFn: (input?: any) => IUpsertFnReturnValues, {uid, predicate}: IUpsertNode, nodes: object[], transaction: Txn, _dgraph=dgraph) {

  const upsertedNodes: string[] = [];
  let error: null | Error = null;

  if(!Array.isArray(nodes)) {
    throw new Error('You must pass nodes as an array of objects')
  }

  if(!isString(predicate)) {
    throw new Error('You must pass in a predicate string as part of the upsert node')
  }
  try {
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

    await transaction.commit()
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

  return upsertedNodes;
}
