import * as dgraph from 'dgraph-js'
import {Txn} from 'dgraph-js';
import {xQuery} from '..';

export interface IVerifyParams {
  nodes: string[]
  predicates: string[]
}

// use to validate the node you are linking to is the shape you want
export async function xValidateNodePredicatesTxn(params: IVerifyParams, dgraphClient: dgraph.DgraphClient): Promise<boolean> {
  const txn = dgraphClient.newTxn();
  return xValidateNodePredicates(params, txn)
}

export async function xValidateNodePredicates(params: IVerifyParams, txn: Txn) {
  // With the @cascade directive, nodes that don’t have all predicates specified in the query are removed.
  const query = `{
    q(func: uid(${params.nodes.join(",")})) @cascade {
      ${params.predicates.join("\n")} 
    }
  }`;

  const {q} = await xQuery(query, txn);
  return (q.length === params.nodes.length)
}