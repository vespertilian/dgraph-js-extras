import * as dgraph from 'dgraph-js';
import * as messages from "dgraph-js/generated/api_pb";
import { Mutation } from 'dgraph-js';
export declare function xSetJSON(object: object, _dgraph?: typeof dgraph): Mutation;
export declare function xSetJSONNow(object: object, _dgraph?: typeof dgraph): Mutation;
export declare function xSetJSONNowTxn(object: object, dgraphClient: dgraph.DgraphClient, _dgraph?: typeof dgraph): Promise<messages.Assigned>;
