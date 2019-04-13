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
export declare function xValidateNodeLinksTxn(params: IValidateNodeLinks, dgraphClient: dgraph.DgraphClient): Promise<boolean>;
export declare function xValidateNodeLinks(params: IValidateNodeLinks, txn: Txn): Promise<boolean>;
