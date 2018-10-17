import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export interface IxQueryParams {
    query: string;
    vars?: {
        [k: string]: any;
    };
}
export declare function xQuery(query: string, txn: Txn): Promise<any>;
export declare function xQueryTxn(query: string, dgraphClient: dgraph.DgraphClient): Promise<any>;
export declare function xQueryWithVars({query, vars}: IxQueryParams, txn: Txn): Promise<any>;
export declare function xQueryWithVarsTxn({query, vars}: IxQueryParams, dgraphClient: dgraph.DgraphClient): Promise<any>;
