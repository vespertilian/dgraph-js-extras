import * as dgraph from 'dgraph-js';
import { Txn } from 'dgraph-js';
export declare function xValidateNodeExistsTxn(uid: string, dgraphClient: dgraph.DgraphClient): Promise<Boolean>;
export declare function xValidateNodeExists(uid: any, txn: Txn): Promise<Boolean>;
