/**
 * @module Set
 */
import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { Mutation } from 'dgraph-js';
export declare function xSetJSON(object: object, _dgraph?: any): Mutation;
export declare function xSetJSONCommit(object: object, _dgraph?: any): Mutation;
export declare function xSetJSONCommitTxn(object: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned>;
