/**
 * @module Delete
 */
import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { Mutation } from 'dgraph-js';
export declare function xDeleteJSON(json: any, _dgraph?: any): Mutation;
export declare function xDeleteJSONCommit(json: any): Mutation;
export declare function xDeleteJSONCommitTxn(json: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned>;
