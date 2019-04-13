/**
 * @module Validate
 */
import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface IValidateNodePredicates {
    nodes: string[];
    predicates: string[];
}
export declare function xValidateNodePredicatesTxn(params: IValidateNodePredicates, dgraphClient: dgraph.DgraphClient): Promise<boolean>;
export declare function xValidateNodePredicates(params: IValidateNodePredicates, txn: Txn): Promise<boolean>;
