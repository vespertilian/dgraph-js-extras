import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { Mutation } from 'dgraph-js';
export declare function xDeleteJSON(json: any, _dgraph?: typeof dgraph): Mutation;
export declare function xDeleteJSONNow(json: any, _dgraph?: typeof dgraph): Mutation;
export declare function xDeleteJSONNowTxn(json: object, dgraphClient: dgraph.DgraphClient): Promise<messages.Assigned>;
