/**
 * @module Validate
 */

import * as dgraph from 'dgraph-js'
import {Txn} from 'dgraph-js';
import {xQuery} from '..';

export async function xValidateNodeExistsTxn(uid: string, dgraphClient: dgraph.DgraphClient): Promise<Boolean> {
  const txn = dgraphClient.newTxn();
  return xValidateNodeExists(uid, txn);
}

export async function xValidateNodeExists(uid, txn: Txn): Promise<Boolean> {

  // see this issue as to why you need to query with _predicate_
  // https://github.com/dgraph-io/dgraph/issues/2086
  const exists = `{
        q(func: uid(${uid})) {
          _predicate_
        }
      }`;

  const {q} = await xQuery(exists, txn);
  return Boolean(q.length > 0)
}
