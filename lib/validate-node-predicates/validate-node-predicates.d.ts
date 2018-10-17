import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface IVerifyParams {
    nodes: string[];
    predicates: string[];
}
export declare function xValidateNodePredicatesTxn(params: IVerifyParams, dgraphClient: dgraph.DgraphClient): Promise<boolean>;
export declare function xValidateNodePredicates(params: IVerifyParams, txn: Txn): Promise<boolean>;
