/**
 * @module Validate
 */

import * as dgraph from 'dgraph-js'
import {Txn} from 'dgraph-js';
import {xQuery} from '..';
import {pathOr} from '../util/path-or';

export interface IValidateNodeLinks {
  node: string;
  edgeName: string,
  linkedNodesUids: string[]
}

export async function xValidateNodeLinksTxn(params: IValidateNodeLinks, dgraphClient: dgraph.DgraphClient): Promise<boolean> {
  const txn = dgraphClient.newTxn();
  return xValidateNodeLinks(params, txn)
}

export async function xValidateNodeLinks(params: IValidateNodeLinks, txn: Txn): Promise<boolean> {
  const query = `{
    q(func: uid(${params.node})) {
      ${params.edgeName} @filter(uid(${params.linkedNodesUids.join(",")})) {
        uid
      }
    }
  }`;

  const {q} = await xQuery(query, txn);

  const getLengthOrNull = (obj) => pathOr(null, ['0', params.edgeName, 'length'], obj);
  const resultsLength = getLengthOrNull(q);

  // while we could return the uid of the failed link
  // its quicker just to return true or false rather than iterate
  return(resultsLength === params.linkedNodesUids.length);
}
